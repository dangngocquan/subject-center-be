
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "App"
          ]
        }
      },
      "/api/v1/users/auth/google": {
        "post": {
          "operationId": "UserController_authGoogle",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RequestGoogleVerifyTokenDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "User"
          ]
        }
      },
      "/api/v1/majors": {
        "get": {
          "operationId": "MajorController_getMajors",
          "parameters": [
            {
              "name": "name",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Major"
          ]
        }
      },
      "/api/v1/majors/sample/json": {
        "get": {
          "operationId": "MajorController_downloadSampleMajorJson",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Major"
          ]
        }
      },
      "/api/v1/majors/json": {
        "post": {
          "operationId": "MajorController_upsertMajorByImportJson",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "Upload a JSON file containing an object with a \"name\" field and a list of subjects.\n\n### **Example Format:**\n```json\n{\n  \"name\": \"Alice\",\n  \"subjects\": [\n    {\n      \"name\": \"string\",\n      \"code\": \"string\",\n      \"credit\": 0,\n      \"prerequisites\": [\"string\"]\n    }\n  ]\n",
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "file": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "summary": "Upload a JSON file and extract data",
          "tags": [
            "Major"
          ]
        }
      }
    },
    "info": {
      "title": "API Documentation",
      "description": "API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "schemas": {
        "RequestGoogleVerifyTokenDto": {
          "type": "object",
          "properties": {
            "token": {
              "type": "string"
            }
          },
          "required": [
            "token"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
