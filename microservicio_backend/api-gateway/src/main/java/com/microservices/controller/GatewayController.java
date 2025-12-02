package com.microservices.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Enumeration;

@RestController
@RequestMapping("/api")
public class GatewayController {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String CATEGORIA_SERVICE_URL = "http://localhost:8081";
    private static final String PRODUCTO_SERVICE_URL = "http://localhost:8082";

    @RequestMapping(value = "/categorias/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<?> proxyCategorias(HttpServletRequest request,
                                              @RequestBody(required = false) Object body) {
        return proxyRequest(request, body, CATEGORIA_SERVICE_URL);
    }

    @RequestMapping(value = "/productos/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<?> proxyProductos(HttpServletRequest request,
                                            @RequestBody(required = false) Object body) {
        return proxyRequest(request, body, PRODUCTO_SERVICE_URL);
    }

    private ResponseEntity<?> proxyRequest(HttpServletRequest request, Object body, String targetBaseUrl) {
        try {
            String path = request.getRequestURI();
            String queryString = request.getQueryString();
            String targetUrl = targetBaseUrl + path;
            
            if (queryString != null && !queryString.isEmpty()) {
                targetUrl += "?" + queryString;
            }
            
            HttpHeaders headers = new HttpHeaders();
            Enumeration<String> headerNames = request.getHeaderNames();
            if (headerNames != null) {
                while (headerNames.hasMoreElements()) {
                    String headerName = headerNames.nextElement();
                    if (!headerName.equalsIgnoreCase("host") && 
                        !headerName.equalsIgnoreCase("content-length") &&
                        !headerName.equalsIgnoreCase("connection")) {
                        Enumeration<String> headerValues = request.getHeaders(headerName);
                        while (headerValues.hasMoreElements()) {
                            headers.add(headerName, headerValues.nextElement());
                        }
                    }
                }
            }
            
            // Asegurar que Content-Type esté presente si hay body
            if (body != null && headers.getContentType() == null) {
                headers.setContentType(MediaType.APPLICATION_JSON);
            }
            
            HttpMethod method = HttpMethod.valueOf(request.getMethod());
            HttpEntity<Object> entity = new HttpEntity<>(body, headers);
            
            return restTemplate.exchange(URI.create(targetUrl), method, entity, Object.class);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error proxying request: " + e.getMessage());
        }
    }
}

