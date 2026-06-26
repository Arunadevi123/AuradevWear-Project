package com.auradev.Backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class ProductImage {

    private String url;

    public ProductImage() {
    }

    public ProductImage(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
