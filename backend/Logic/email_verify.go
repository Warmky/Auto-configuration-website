package Logic

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

// 统一前端友好结构
type DnsSecurityScanResult struct {
	Domain string              `json:"domain"`
	BIMI   string              `json:"bimi,omitempty"`
	DKIM   string              `json:"dkim,omitempty"`
	DMARC  string              `json:"dmarc,omitempty"`
	MX     []string            `json:"mx,omitempty"`
	SPF    string              `json:"spf,omitempty"`
	Advice map[string][]string `json:"advice,omitempty"`
}

type DnsSecurityScanResponse struct {
	Results []DnsSecurityScanResult `json:"results"`
	Error   string                  `json:"error,omitempty"`
}

// GET /api/dns-security-scan?domain=example.com
// POST /api/dns-security-scan batch, body: {"domains":["a.com","b.com"]}
func HandleDnsSecurityScan(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var targets []string
	if r.Method == "GET" {
		domain := r.URL.Query().Get("domain")
		if domain == "" {
			http.Error(w, `{"error":"domain parameter is required"}`, http.StatusBadRequest)
			return
		}
		targets = []string{domain}
	} else if r.Method == "POST" {
		var body struct {
			Domains []string `json:"domains"`
		}
		data, _ := io.ReadAll(r.Body)
		defer r.Body.Close()
		if err := json.Unmarshal(data, &body); err != nil || len(body.Domains) == 0 {
			http.Error(w, `{"error":"invalid request body, expected {\"domains\": [\"a.com\",\"b.com\"]}"}`, http.StatusBadRequest)
			return
		}
		targets = body.Domains
	}

	results := []DnsSecurityScanResult{}
	client := &http.Client{Timeout: 20 * time.Second}

	for _, domain := range targets {
		apiUrl := fmt.Sprintf("http://localhost:8082/api/v1/scan/%s", url.QueryEscape(domain))
		resp, err := client.Get(apiUrl)
		if err != nil {
			results = append(results, DnsSecurityScanResult{
				Domain: domain,
				Advice: map[string][]string{"error": {err.Error()}},
			})
			continue
		}
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		if resp.StatusCode >= 400 {
			results = append(results, DnsSecurityScanResult{
				Domain: domain,
				Advice: map[string][]string{"error": {string(body)}},
			})
			continue
		}

		var dssResp struct {
			ScanResult struct {
				Domain string   `json:"domain"`
				BIMI   string   `json:"bimi,omitempty"`
				DKIM   string   `json:"dkim,omitempty"`
				DMARC  string   `json:"dmarc,omitempty"`
				MX     []string `json:"mx,omitempty"`
				SPF    string   `json:"spf,omitempty"`
			} `json:"scanResult"`
			Advice map[string][]string `json:"advice,omitempty"`
		}
		if err := json.Unmarshal(body, &dssResp); err != nil {
			results = append(results, DnsSecurityScanResult{
				Domain: domain,
				Advice: map[string][]string{"error": {"invalid DSS response"}},
			})
			continue
		}

		results = append(results, DnsSecurityScanResult{
			Domain: dssResp.ScanResult.Domain,
			BIMI:   dssResp.ScanResult.BIMI,
			DKIM:   dssResp.ScanResult.DKIM,
			DMARC:  dssResp.ScanResult.DMARC,
			MX:     dssResp.ScanResult.MX,
			SPF:    dssResp.ScanResult.SPF,
			Advice: dssResp.Advice,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(DnsSecurityScanResponse{Results: results})
}

func setCorsHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
