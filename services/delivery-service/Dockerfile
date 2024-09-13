FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build

WORKDIR /src

COPY ./delivery-service.docker.sln /src/delivery-service.sln
COPY ./delivery-service-api-scripts/delivery-service-api-scripts.csproj /src/delivery-service-api-scripts/delivery-service-api-scripts.csproj
COPY ./delivery-service-api/delivery-service-api.csproj /src/delivery-service-api/delivery-service-api.csproj

RUN dotnet restore

COPY ./delivery-service-api-scripts /src/delivery-service-api-scripts
COPY ./delivery-service-api /src/delivery-service-api

WORKDIR /src/delivery-service-api-scripts
RUN dotnet publish -c Release -o /release-scripts

WORKDIR /src/delivery-service-api
RUN dotnet publish -c Release -o /release-api

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime

RUN apk add --no-cache icu-libs

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

WORKDIR /app

COPY --from=build /release-scripts /app
COPY --from=build /release-api /app

EXPOSE 8000

CMD ENVIRONMENT=migrations dotnet /app/delivery-service-api-scripts.dll run-migrations && dotnet /app/delivery-service-api.dll
