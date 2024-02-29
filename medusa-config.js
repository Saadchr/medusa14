const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7001,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const BACKEND_URL = process.env.BACKEND_URL || "localhost:9000";
const STORE_URL = "https://www.samistore.ma";

const GoogleClientId = process.env.GOOGLE_CLIENT_ID || "";
const GoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "medusa-plugin-auth",
    /** @type {import('medusa-plugin-auth').AuthOptions} */
    options: [
      {
        type: "google",
        // strict: "all", // or "none" or "store" or "admin"
        strict: "none",
        identifier: "google",
        clientID: GoogleClientId,
        clientSecret: GoogleClientSecret,
        store: {
          callbackUrl: `${BACKEND_URL}/store/auth/google/cb`,
          failureRedirect: `${STORE_URL}/login`,
          // The success redirect can be overriden from the client by adding a query param `?redirectTo=your_url` to the auth url
          // This query param will have the priority over this configuration
          successRedirect: `${STORE_URL}/account`,
          authPath: "/store/auth/google",
          // authCallbackPath: "/store/auth/google/cb",
          expiresIn: 24 * 60 * 60 * 1000,
          // verifyCallback: (container, req, accessToken, refreshToken, profile, strict) => {
          //    // implement your custom verify callback here if you need it
          // },
          scope: ["email", "profile"],
        },
      },
    ],
  },
  // {
  //   resolve: "@medusajs/admin",
  //   /** @type {import('@medusajs/admin').PluginOptions} */
  //   options: {
  //     autoRebuild: false,
  //     develop: {
  //       open: process.env.OPEN_BROWSER !== "false",
  //     },
  //   },
  // },
  {
    resolve: "medusa-plugin-meilisearch",
    options: {
      config: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      },
      settings: {
        products: {
          indexSettings: {
            searchableAttributes: [
              "title",
              "description",
              "price",
              "collection_title",
              "categories",
            ],
            displayedAttributes: [
              "title",
              "description",
              "price",
              "thumbnail",
              "id",
              "handle",
              "collection_title",
              "categories",
              "battery",
              "cheapest_variant_price_per_country",
            ],
            filterableAttributes: [
              "categories",
              "battery",
              "cheapest_variant_price_per_country",
            ],
            sortableAttributes: [
              "created_at",
              "cheapest_variant_price_per_country",
              "battery",
            ],
          },
          keepZeroFacets: true,
          primaryKey: "id",
          transformer: (product) => {
            const regionToCountryMapping = JSON.parse(
              process.env.REGION_TO_COUNTRY_MAPPING
            );
            const cheapestPricePerCountry = product.variants.reduce(
              (acc, variant) => {
                {
                  variant.prices.forEach((price) => {
                    {
                      const countryCode =
                        regionToCountryMapping[price.region_id];
                      if (
                        countryCode &&
                        (!acc[countryCode] || price.amount < acc[countryCode])
                      ) {
                        {
                          acc[countryCode] = price.amount;
                        }
                      }
                    }
                  });
                  return acc;
                }
              },
              {}
            );
            const cheapestPricePerCountryInUnits = {};
            for (const [countryCode, price] of Object.entries(
              cheapestPricePerCountry
            )) {
              cheapestPricePerCountryInUnits[countryCode] = price / 100;
            }

            return {
              id: product.id,
              title: product.title,
              description: product.description || "", // Handle null or undefined values
              price: product.price,
              thumbnail: product.thumbnail,
              handle: product.handle,
              collection_title: product.collection
                ? product.collection.title
                : null,
              categories: product.categories
                ? {
                    lvl0: "products",
                    ...product.categories.reduce((acc, cat, index) => {
                      // Constructing each level based on the category hierarchy
                      const level = `lvl${index + 1}`;
                      acc[level] =
                        index === 0
                          ? `products > ${cat.name}`
                          : `${acc[`lvl${index}`]} > ${cat.name}`;
                      return acc;
                    }, {}),
                  }
                : null,
              battery: product.metadata?.Batterie
                ? parseInt(product.metadata.Batterie)
                : 0,
              cheapest_variant_price_per_country:
                cheapestPricePerCountryInUnits?.ma,
            };
          },
        },
      },
    },
  },
  {
    resolve: `medusa-custom-attributes`,
    options: {
      enableUI: true,
      projectConfig: {
        store_cors: process.env.STORE_CORS,
        admin_cors: process.env.ADMIN_CORS,
      },
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      // other options...
    },
  },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: process.env.SENDGRID_ORDER_PLACED_ID,
    },
  },
  {
    resolve: "medusa-file-r2",
    options: {
      account_id: "eef1feb6c3e441a7501f892b6cc5fa51",
      access_key: "60e395327f8212cd428d511c15cf47c7",
      secret_key:
        "618a6a1f44d14cd2b4091cdea5b32269d7ae58a630030a1b460790949d1f4d1a",
      bucket: "samistore",
      public_url: "https://www.juststoring.com",
    },
  },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: process.env.EVENTS_REDIS_URL,
    },
  },

  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: process.env.CACHE_REDIS_URL,
      ttl: 30,
    },
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  redis_url: REDIS_URL,
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
