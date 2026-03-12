package com.hostmyevent.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class PinataService {

    @Value("${pinata.jwt.key}")
    private String pinataJwtKey;

    private static final String PINATA_API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    // Default Pinata gateway, configure custom domain if needed
    private static final String IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

    public String uploadFile(MultipartFile file) throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(pinataJwtKey);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        // Pinata API expects "file"
        body.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(PINATA_API_URL, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            String responseBody = response.getBody();
            // The response contains JSON like {"IpfsHash":"QmX...", "PinSize":1234,
            // "Timestamp":"..."}
            // A simple String extraction avoids requiring an extra JSON parsing dependency
            // just for this
            if (responseBody != null && responseBody.contains("\"IpfsHash\"")) {
                int start = responseBody.indexOf("\"IpfsHash\":\"") + 12;
                int end = responseBody.indexOf("\"", start);
                String ipfsHash = responseBody.substring(start, end);

                return IPFS_GATEWAY + ipfsHash;
            }
        }

        throw new RuntimeException("Failed to upload file to Pinata IPFS: " + response.getStatusCode());
    }
}
