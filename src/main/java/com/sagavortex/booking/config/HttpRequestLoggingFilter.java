package com.sagavortex.booking.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(1)
public class HttpRequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(HttpRequestLoggingFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        long startedAt = System.currentTimeMillis();

        try {
            filterChain.doFilter(request, response);
        } catch (RuntimeException exception) {
            long durationMs = System.currentTimeMillis() - startedAt;
            log.error(
                    "HTTP {} {} -> 500 in {} ms (unhandled exception: {})",
                    request.getMethod(),
                    request.getRequestURI(),
                    durationMs,
                    exception.getClass().getSimpleName(),
                    exception
            );
            throw exception;
        }

        long durationMs = System.currentTimeMillis() - startedAt;
        int status = response.getStatus();

        if (status >= 500) {
            log.error("HTTP {} {} -> {} in {} ms",
                    request.getMethod(), request.getRequestURI(), status, durationMs);
            return;
        }

        if (status >= 400) {
            log.warn("HTTP {} {} -> {} in {} ms",
                    request.getMethod(), request.getRequestURI(), status, durationMs);
            return;
        }

        log.info("HTTP {} {} -> {} in {} ms",
                request.getMethod(), request.getRequestURI(), status, durationMs);
    }
}
