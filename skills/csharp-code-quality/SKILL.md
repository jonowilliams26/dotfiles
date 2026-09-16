---
name: csharp-code-quality
description: Apply repository C# and ASP.NET Core project and code-quality conventions when creating, configuring, writing, modifying, refactoring, or reviewing C# projects and web APIs.
---

# C# Code Quality

Apply these conventions to all C# projects and code in scope. Apply the ASP.NET Core conventions below when working on ASP.NET Core projects and web APIs.

## Private fields

- Name private fields using lower camel case.
- Do not prefix private field names with underscores.
- Rename all references when correcting a field name.

```csharp
private readonly ILogger logger;
private int retryCount;
```

## Local variable type inference

Use `var` for local variables when an explicit type is not required and does not add value. Keep an explicit type only when it is needed for correctness or makes otherwise unclear code easier to understand.

```csharp
var customer = await customerRepository.GetAsync(customerId);
var retryCount = 0;
```

## Collection return types

Keep collection return types concrete and simple such as `T[]` or `List<T>` etc. Do not introduce `IReadOnlyList<T>` merely to hide the concrete type or imply immutability.

```csharp
// Bad
public IReadOnlyList<Customer> GetCustomers() => customers.ToList();

// Good
public List<Customer> GetCustomers() => customers.ToList();

// Good
public Customer[] GetCustomers() => customers.ToArray();
```

## Member names

Use `nameof` whenever a string value identifies a member. Do not use member-name string literals.

```csharp
ArgumentNullException.ThrowIfNull(customer, nameof(customer));
OnPropertyChanged(nameof(DisplayName));
```

## Multiline invocations

 ALWAYS add a blank line after a multiline invocation to separate it from the following statement. This makes the boundary between the invocation and the next statement easier to see.

 ```csharp
// Bad
var orders = orders
    .Where(order => order.IsActive)
    .OrderBy(order => order.Date)
    .ToArray();
var total = orders.Sum(order => order.Amount);

// Good
var orders = orders
    .Where(order => order.IsActive)
    .OrderBy(order => order.Date)
    .ToArray();

var total = orders.Sum(order => order.Amount);
```

- DO NOT use multiline invocations to avoid line length limits.
- If a method has 1 or 2 arguments, keep the invocation on a single line.
- Only use multiline invocations when a method has 3 or more arguments and the invocation exceeds the line length limit.

```csharp
// Bad
var user = await database.FindByIdAsync(
    userId,
    cancellationToken
);

// Good
var user = await database.FindByIdAsync(userId, cancellationToken);
```

For a method invocation split across multiple lines, place the closing parenthesis on its own line and align it with the statement containing the invocation. Do not append it to the final argument.

```csharp
// Bad
using var response = await fixture.ApiClient.PostAsJsonAsync(
    "/persistence-probes",
    request,
    timeout.Token);

// Good
using var response = await fixture.ApiClient.PostAsJsonAsync(
    "/persistence-probes",
    request,
    timeout.Token
);
```

## Method chaining

Prefer multiline formatting for fluent method chains, especially LINQ queries. Place each chained method on its own line and indent it.

```csharp
var activeCustomerNames = customers
	.Where(customer => customer.IsActive)
	.OrderBy(customer => customer.Name)
	.Select(customer => customer.Name)
	.ToArray();
```

## Conditional statements

Always use braces for `if` statement bodies, including single statements and early returns. Format opening braces on the line after the condition.

```csharp
// Bad
if (condition) return;

// Good
if (condition)
{
    return;
}
```

## Multiline conditions

Do not place a multiline condition directly inside an `if` statement. Extract it to a well-named boolean variable so the condition's meaning is clear and the `if` statement remains easy to scan. Name the variable for what being `true` means rather than using a generic name such as `condition`.

```csharp
// Bad
if (values.Any(value =>
        value < minimum ||
        value > maximum))
{
    return false;
}

// Good
var hasOutOfRangeValue = values.Any(value =>
    value < minimum ||
    value > maximum
);

if (hasOutOfRangeValue)
{
    return false;
}
```

## Vertical spacing

- Use a single blank line between adjacent logical blocks when continuation indentation would otherwise make the boundary difficult to see. 
- Always separate a multiline assignment or fluent expression from the statement that follows it.
- Do not use multiple consecutive blank lines.

```csharp
// Bad
var total = items
    .Select(item => item.Value)
    .Sum();
if (total > limit)
{
    return false;
}

// Good
var total = items
    .Select(item => item.Value)
    .Sum();

if (total > limit)
{
    return false;
}
```

## Immutable data types

Define immutable data types as `record` types whose properties are `init` only. Do not model immutable data with a `class` or properties using `set`.

```csharp
public record Customer
{
    public required string Name { get; init; }
    public required string EmailAddress { get; init; }
}
```

## Test names

Name test methods using `SystemUnderTest_WhenCondition_ShouldResult`.

- `SystemUnderTest` identifies the member or behavior being tested.
- `WhenCondition` describes the relevant input or state.
- `ShouldResult` describes the expected observable outcome.

Use PascalCase within each segment and separate the segments with underscores.

```csharp
public void CalculateTotal_WhenCartIsEmpty_ShouldReturnZero()
public void Subscribe_WhenEmailAddressIsInvalid_ShouldRejectSubscription()
```

## Code colocation

Prefer colocating closely related code in the same file instead of applying a one-type-per-file rule.

The following is an example of this guidance:

```csharp
public record Subscription
{
    public required SubscriptionStatus Status { get; init; }
}

public enum SubscriptionStatus
{
    Trial,
    Active,
    Cancelled,
}

public static class SubscriptionStatusExtensions
{
    public static bool AllowsAccess(this SubscriptionStatus status) =>
        status is SubscriptionStatus.Trial or SubscriptionStatus.Active;
}
```

## Project configuration

### Package management

Use NuGet Central Package Management. Define package versions in a repository-level `Directory.Packages.props` file and omit versions from project-level `PackageReference` items.

```xml
<!-- Directory.Packages.props -->
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>
  <ItemGroup>
    <PackageVersion Include="Microsoft.AspNetCore.OpenApi" Version="10.0.0" />
  </ItemGroup>
</Project>
```

```xml
<!-- Project file -->
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.OpenApi" />
</ItemGroup>
```

### Compiler warnings

Enable warnings as errors for every project. Prefer defining this once in a repository-level `Directory.Build.props` file so all projects use the same policy.

```xml
<Project>
  <PropertyGroup>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>
</Project>
```

## ASP.NET Core

### Endpoint style

Use Minimal APIs instead of controllers. Define endpoints with route-handler methods rather than controller classes and action methods.

```csharp
internal sealed class GetPostEndpoint : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/posts/{id:int}", Handle);
    }

    private static Results<Ok<GetPostHttpResponse>, NotFound> Handle(
        int id,
        PostService postService)
    {
        var post = postService.FindById(id);
        if (post is null)
        {
            return TypedResults.NotFound();
        }

        var response = new GetPostHttpResponse
        {
            Id = post.Id,
            Title = post.Title,
        };

        return TypedResults.Ok(response);
    }
}

public record GetPostHttpResponse
{
    public required int Id { get; init; }
    public required string Title { get; init; }
}
```

### Dependency injection entry point

Create `DependencyInjection.cs` at the application project root. Keep every extension method used to register application services in this file so service registration has one discoverable entry point. Call these extension methods from `Program.cs` rather than defining registration logic there or scattering registration extensions across feature files.

```csharp
internal static class DependencyInjection
{
    // E.g When requiring a builder rather than just an IServiceCollection (e.g. Aspire database extensions)
    public static TBuilder AddDatabase<TBuilder>(this TBuilder builder) where TBuilder : IHostApplicationBuilder
    {
        // Register services
        return builder;
    }

    public static IServiceCollection AddUserServices(this IServiceCollection services)
    {
        // Register services...
        return services;
    }

    public static IServiceCollection AddMetricServices(this IServiceCollection services)
    {
        // Register services...
        return services;
    }
}
```

### Endpoint entry point

Create `Endpoints.cs` at the application project root as the entry point for all application endpoints. Define `IEndpoint` in this file, implement it on each endpoint, and register every endpoint through `MapEndpoints`. Call `app.MapEndpoints()` from `Program.cs` rather than mapping individual endpoints there.

```csharp
internal static class Endpoints
{
    public static IEndpointRouteBuilder MapEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("")
            .MapUserEndpoints()
            .MapMetricEndpoints();

        return endpoints;
    }

    private static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/users")
            .MapEndpoint<GetUserEndpoint>()
            .MapEndpoint<CreateUserEndpoint>();

        return app;
    }

    private static IEndpointRouteBuilder MapMetricEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/metrics")
            .MapEndpoint<GetMetricEndpoint>();

        return endpoints;
    }

    public static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app) where TEndpoint : IEndpoint
    {
        TEndpoint.Map(app);
        return app;
    }
}

internal interface IEndpoint
{
    static abstract void Map(IEndpointRouteBuilder app);
}
```

### Vertical slice architecture

Organize each use case as its own vertical slice within its module. A slice owns its endpoint, request and response contracts, handler, and use-case-specific supporting code so it can evolve independently.

Start each use case with the simple, single-file structure. Refactor it into its own directory only when the use case grows complex enough to need multiple files. Allow a complex use case to contain as many internal services and supporting files as it needs. Do not introduce the complex structure speculatively, force every slice into the same structure, or extract slice-specific code into shared abstractions merely to reduce its size.

```text
<module>/
├── Services/               # Shared services used by multiple slices in the module
├── SimpleEndpoint.cs       # Endpoint, request, response, and handler
└── ComplexEndpoint/
    ├── Endpoint.cs
    └── <other use-case-specific code>
```

### Input binding

Group endpoint inputs into request records. Rely on Minimal API binding inference and do not add source attributes such as `[FromBody]`, `[FromRoute]`, `[FromQuery]`, or `[FromServices]` when the framework already infers the intended source. Add a source attribute only when it changes or disambiguates the inferred binding, such as binding a property from a specifically named header.

```csharp
// Bad: the complex request is already inferred from the request body.
static void Handle([FromBody] ExampleHttpRequest request)
{
}

// Good
static void Handle(ExampleHttpRequest request)
{
}
```

Use `[AsParameters]` only when:

- The HTTP method does not support inferred body binding and the request groups route, query, or header values.
- The request composes values from multiple sources, such as route values and a request body.

Do not use `[AsParameters]` for a body-only request.

In the following example, `Id` is inferred from the matching route parameter, while `[FromHeader]` is required because Minimal APIs do not infer values from request headers:

```csharp
app.MapGet("/posts/{id}", GetPost);

static Results<Ok<GetPostHttpResponse>, NotFound> GetPost([AsParameters] GetPostHttpRequest request)
{
    // Endpoint implementation.
}

public record GetPostHttpRequest
{
    public required int Id { get; init; }

    [FromHeader(Name = "X-Correlation-Id")]
    public required string CorrelationId { get; init; }
}
```

### HTTP contracts

- Define request and response contracts as immutable `record` types.
- Use `init` only properties. Do not use `set` properties.
- Add the `required` keyword to every required property. Without it, OpenAPI schema generation marks the property as optional.
- Suffix request contract names with `HttpRequest`.
- Suffix response contract names with `HttpResponse`.
- Use concrete collection types for materialized response collections, consistent with the collection return type conventions above.

```csharp
public record GetPostsHttpRequest
{
    public required int Page { get; init; }
}

public record GetPostsHttpResponse
{
    public required PostHttpResponse[] Posts { get; init; }
}
```

### Typed responses

Return strongly typed responses with `TypedResults`.

When an endpoint can return multiple response types, declare its return type with `Results<TResponse1, TResponse2>` or the corresponding higher-arity `Results` type.

```csharp
static Results<Ok<GetPostHttpResponse>, NotFound> GetPost([AsParameters] GetPostHttpRequest request)
{
    var response = FindPost(request.Id);
    if (response is null)
    {
        return TypedResults.NotFound();
    }

    return TypedResults.Ok(response);
}
```
