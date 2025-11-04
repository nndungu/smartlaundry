package ke.co.smartlaundry.configuration;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class MockGoogleConfig {

    @Bean
    public GoogleIdTokenVerifier googleIdTokenVerifier() throws Exception {
        // Create a mock verifier
        GoogleIdTokenVerifier mockVerifier = Mockito.mock(GoogleIdTokenVerifier.class);

        // Stub verify() to return a fake payload for test tokens
        Mockito.when(mockVerifier.verify(Mockito.anyString()))
                .thenAnswer(invocation -> {
                    String token = invocation.getArgument(0);
                    if ("valid-test-token".equals(token)) {
                        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
                        payload.setEmail("testuser@smartlaundry.ke");
                        payload.set("given_name", "Test");
                        payload.set("family_name", "User");
                        return new GoogleIdToken(new GoogleIdToken.Header(), payload, null, null);
                    }
                    return null; // invalid token
                });

        return mockVerifier;
    }
}
