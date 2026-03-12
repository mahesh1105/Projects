package com.fitness.aiservice.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

// @Configuration - Registers the class as a special configuration class - Spring treats it like a bean factory.
// @LoadBalanced - Resolves the service name by finding the actual IP and Port

/*
  @Bean

  Spring then:
  ------------
  1. Calls this method
  2. Gets the returned object
  3. Stores it inside something called the Application Context
  4. Registers it as a bean

    So now Spring “knows”:
    I have one object of type WebClient

  WebClientConfig
        |
        v
  Creates WebClient bean
        |
        v
  Stored in Spring Container
        |
        v
  GeminiService constructor asks for WebClient
        |
        v
  Spring injects it
*/

@Configuration
public class WebClientConfig {
    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder() // returns the Builder Object
                .baseUrl("https://generativelanguage.googleapis.com")
                .build(); // returns the WebClient Object
    }
}

/*
  🧠 Step 1: What @Configuration Really Means

    When Spring starts:
    • It scans classes.
    • Sees @Configuration.
    • Registers this class as a special configuration class.

    Spring treats it like a bean factory.

  🧠 Step 2: What @Bean Actually Means

    When Spring sees:
    -----------------
    @Bean
    public WebClient.Builder webClientBuilder()

    It understands:
    “This method returns an object that I should manage inside the container.”

    So during startup, Spring:
    1️⃣ Calls the method
    2️⃣ Gets the returned object
    3️⃣ Stores it inside the ApplicationContext
    4️⃣ Registers it by type (WebClient.Builder)

    So internally, it’s almost like Spring does:

    WebClient.Builder builder = webClientBuilder();
    applicationContext.registerBean(builder);

  🧠 Step 3: How Second Bean Gets First Bean?

    Now look at this:
    -----------------
    @Bean
    public WebClient userServiceWebClient(WebClient.Builder webClientBuilder)

    Notice the parameter.

    Spring sees:
    This method requires a WebClient.Builder.

    So before calling this method, Spring:
    1️⃣ Looks inside ApplicationContext
    2️⃣ Finds a bean of type WebClient.Builder
    3️⃣ Injects it as method argument
    4️⃣ Calls the method
    5️⃣ Stores returned WebClient as another bean

    So effectively:
    ===============
    WebClient.Builder builder = getBean(WebClient.Builder.class);
    WebClient client = userServiceWebClient(builder);
    registerBean(client);

    You don’t see this happening — but Spring does it.

  🧱 Important Internal Mechanism
  -------------------------------
    Spring uses something called:
    Dependency Injection via Method Injection.

    It inspects:
    Method parameters
    Matches them by type
    Resolves dependencies automatically

  🔥 What Happens At Startup (Simplified Timeline)

    1️⃣ Spring scans @Configuration
    2️⃣ Finds first @Bean
    3️⃣ Executes webClientBuilder()
    4️⃣ Stores object in container
    5️⃣ Finds second @Bean
    6️⃣ Sees it needs WebClient.Builder
    7️⃣ Injects existing bean
    8️⃣ Executes method
    9️⃣ Stores returned WebClient bean

    All happens during application startup.

  🧠 Important Detail You Should Know
  -----------------------------------
    @Configuration classes are actually proxied (CGLIB proxy).

    Why?
    To ensure that if one @Bean method calls another directly:

    @Bean
    public A a() {
       return new A(b());
    }

    Spring will NOT create new instance every time.
    It intercepts and returns the managed singleton.

    This is advanced but important.
 */