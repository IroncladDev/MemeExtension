/** @type {import('next').NextConfig} */
/** @jsx jsx */

const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: false,
  poweredByHeader: false,
  //output: 'export',
  async headers() {
    return [
      {
        source: "/:file*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ]
      }
    ]
  },
  webpack: (config) => {
    // Now we can import GraphQL files as simple as:
    //
    // import query from '../somequery.gql';
    //
    // should be used with a proper GraphQL
    // library like @apollo/client.
    config.module.rules.push({
      test: /\.(graphql|gql)/,
      use: [
        {
          loader: "graphql-tag/loader",
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
