
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
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponseMajorListDto"
                  }
                }
              }
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
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponseSampleJsonDto"
                  }
                }
              }
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
            "description": "Upload a JSON file containing an object with a \"name\" field and a list of items (subjects).\n\n### **Structure:**\n```json\n{\n  \"name\": \"string\",\n  \"items\": [\n    {\n      \"name\": \"string\",\n      \"code\": \"string\",\n      \"credit\": \"number\",\n      \"prerequisites\": [\"string\"],\n      \"genCode\": \"string\",\n      \"parentGenCode\": \"string | null\",\n      \"stt\": \"string\",\n      \"level\": \"number\",\n      \"selectionRule\": \"ALL | ONE | MULTI | null\",\n      \"minCredits\": \"number | null\",\n      \"minChildren\": \"number | null\",\n      \"isLeaf\": \"boolean\"\n    }\n  ]\n}\n```",
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
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponseMajorUpsertDto"
                  }
                }
              }
            }
          },
          "summary": "Upload a JSON file and extract data",
          "tags": [
            "Major"
          ]
        }
      },
      "/api/v1/majors/{majorId}/detail": {
        "get": {
          "operationId": "MajorController_getMajorById",
          "parameters": [
            {
              "name": "majorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponseMajorDetailDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Major"
          ]
        }
      },
      "/api/v1/plans": {
        "get": {
          "operationId": "PlanController_getPlans",
          "parameters": [
            {
              "name": "name",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "token",
              "in": "header",
              "description": "token",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ResponsePlanListDto"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "summary": "Get plans of user",
          "tags": [
            "Plan"
          ]
        },
        "post": {
          "operationId": "PlanController_createPlan",
          "parameters": [
            {
              "name": "token",
              "in": "header",
              "description": "token",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RequestUpsertPlanDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponsePlanUpsertDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "summary": "Create new plan",
          "tags": [
            "Plan"
          ]
        }
      },
      "/api/v1/plans/export/sample/json": {
        "get": {
          "operationId": "PlanController_downloadSamplePlanJson",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Download sample plan JSON file"
            }
          },
          "tags": [
            "Plan"
          ]
        }
      },
      "/api/v1/plans/{planId}/export/json": {
        "get": {
          "operationId": "PlanController_downloadPlanJson",
          "parameters": [
            {
              "name": "planId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "token",
              "in": "header",
              "description": "token",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Download plan JSON file"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "summary": "",
          "tags": [
            "Plan"
          ]
        }
      },
      "/api/v1/plans/import/json": {
        "post": {
          "operationId": "PlanController_upsertPlanByImportJson",
          "parameters": [
            {
              "name": "token",
              "in": "header",
              "description": "token",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Upload a JSON file containing an object with a \"name\" field and a list of items.\n\n### **Example Format:**\n```json\n{\n  \"name\": \"Your plan name\",\n  \"items\": [\n    {\n      \"name\": \"string\",\n      \"code\": \"string\",\n      \"credit\": 0,\n      \"prerequisites\": [\"string\"],\n      \"grade4\": 0,\n      \"gradeLatin\": \"string\"\n    }\n  ]\n}\n```",
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
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponsePlanUpsertDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "summary": "",
          "tags": [
            "Plan"
          ]
        }
      },
      "/api/v1/plans/{planId}/item": {
        "patch": {
          "operationId": "PlanController_upsertPlanItem",
          "parameters": [
            {
              "name": "token",
              "in": "header",
              "description": "token",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RequestUpsertPlanItemDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponsePlanUpsertDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "summary": "",
          "tags": [
            "Plan"
          ]
        }
      },
      "/api/v1/plans/{planId}": {
        "patch": {
          "operationId": "PlanController_upsertPlan",
          "parameters": [
            {
              "name": "planId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "token",
              "in": "header",
              "description": "token",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RequestUpsertPlanDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponsePlanUpsertDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "summary": "",
          "tags": [
            "Plan"
          ]
        },
        "delete": {
          "operationId": "PlanController_deletePlan",
          "parameters": [
            {
              "name": "planId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "token",
              "in": "header",
              "description": "token",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponsePlanDeleteDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "summary": "",
          "tags": [
            "Plan"
          ]
        }
      },
      "/api/v1/plans/{planId}/details": {
        "get": {
          "operationId": "PlanController_getPlanDetails",
          "parameters": [
            {
              "name": "planId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "token",
              "in": "header",
              "description": "token",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponsePlanDetailsDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "summary": "",
          "tags": [
            "Plan"
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
        },
        "ResponseMajorItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "code": {
              "type": "string"
            },
            "credit": {
              "type": "number"
            },
            "prerequisites": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "majorId": {
              "type": "number"
            },
            "genCode": {
              "type": "string"
            },
            "parentGenCode": {
              "type": "string",
              "nullable": true
            },
            "stt": {
              "type": "string"
            },
            "level": {
              "type": "number"
            },
            "selectionRule": {
              "type": "string",
              "enum": [
                "ALL",
                "ONE",
                "MULTI"
              ],
              "nullable": true
            },
            "minCredits": {
              "type": "number",
              "nullable": true
            },
            "minChildren": {
              "type": "number",
              "nullable": true
            },
            "isLeaf": {
              "type": "boolean"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "createdAt",
            "updatedAt"
          ]
        },
        "ResponseMajorDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ResponseMajorItemDto"
              }
            }
          }
        },
        "ResponseMajorListDto": {
          "type": "object",
          "properties": {
            "isBadRequest": {
              "type": "boolean"
            },
            "message": {
              "type": "string"
            },
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ResponseMajorDto"
              }
            }
          },
          "required": [
            "isBadRequest",
            "message",
            "data"
          ]
        },
        "ResponseSampleJsonDto": {
          "type": "object",
          "properties": {
            "file": {
              "type": "string",
              "format": "binary"
            }
          },
          "required": [
            "file"
          ]
        },
        "ResponseMajorUpsertDto": {
          "type": "object",
          "properties": {
            "isBadRequest": {
              "type": "boolean"
            },
            "message": {
              "type": "string"
            },
            "data": {
              "$ref": "#/components/schemas/ResponseMajorDto"
            }
          },
          "required": [
            "isBadRequest",
            "message",
            "data"
          ]
        },
        "ResponseMajorDetailDto": {
          "type": "object",
          "properties": {
            "isBadRequest": {
              "type": "boolean"
            },
            "message": {
              "type": "string"
            },
            "data": {
              "$ref": "#/components/schemas/ResponseMajorDto"
            }
          },
          "required": [
            "isBadRequest",
            "message",
            "data"
          ]
        },
        "ResponsePlanListDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "accountId": {
              "type": "number"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "id",
            "name",
            "accountId",
            "createdAt",
            "updatedAt"
          ]
        },
        "ResponsePlanItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "code": {
              "type": "string"
            },
            "credit": {
              "type": "number"
            },
            "prerequisites": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "grade4": {
              "type": "number"
            },
            "gradeLatin": {
              "type": "string"
            },
            "planId": {
              "type": "number"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "id",
            "name",
            "code",
            "credit",
            "prerequisites",
            "grade4",
            "gradeLatin",
            "planId",
            "createdAt",
            "updatedAt"
          ]
        },
        "ResponsePlanUpsertDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ResponsePlanItemDto"
              }
            },
            "accountId": {
              "type": "number"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "id",
            "name",
            "items",
            "accountId",
            "createdAt",
            "updatedAt"
          ]
        },
        "RequestUpsertPlanItemDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "code": {
              "type": "string"
            },
            "credit": {
              "type": "number"
            },
            "prerequisites": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "grade4": {
              "type": "number"
            },
            "gradeLatin": {
              "type": "string"
            }
          }
        },
        "RequestUpsertPlanDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/RequestUpsertPlanItemDto"
              }
            }
          }
        },
        "ResponsePlanCreditsDto": {
          "type": "object",
          "properties": {
            "totalCredits": {
              "type": "number"
            },
            "totalSubjects": {
              "type": "number"
            },
            "totalSubjectsCompleted": {
              "type": "number"
            },
            "totalCreditsCompleted": {
              "type": "number"
            },
            "totalSubjectsIncomplete": {
              "type": "number"
            },
            "totalCreditsIncomplete": {
              "type": "number"
            },
            "totalSubjectsCanImprovement": {
              "type": "number"
            },
            "totalCreditsCanImprovement": {
              "type": "number"
            },
            "currentCPA": {
              "type": "number"
            },
            "grades": {
              "type": "object"
            },
            "totalGradeCompleted": {
              "type": "number"
            },
            "totalGradeCanImprovement": {
              "type": "number"
            }
          },
          "required": [
            "totalCredits",
            "totalSubjects",
            "totalSubjectsCompleted",
            "totalCreditsCompleted",
            "totalSubjectsIncomplete",
            "totalCreditsIncomplete",
            "totalSubjectsCanImprovement",
            "totalCreditsCanImprovement",
            "currentCPA",
            "grades",
            "totalGradeCompleted",
            "totalGradeCanImprovement"
          ]
        },
        "ResponsePlanCPAMarkDto": {
          "type": "object",
          "properties": {
            "grade4": {
              "type": "number"
            },
            "type": {
              "type": "string"
            },
            "details": {
              "type": "object"
            }
          },
          "required": [
            "grade4",
            "type",
            "details"
          ]
        },
        "ResponsePlanCPADto": {
          "type": "object",
          "properties": {
            "marks": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ResponsePlanCPAMarkDto"
              }
            }
          },
          "required": [
            "marks"
          ]
        },
        "ResponsePlanCPASummaryDto": {
          "type": "object",
          "properties": {
            "withImprovements": {
              "$ref": "#/components/schemas/ResponsePlanCPADto"
            },
            "withoutImprovements": {
              "$ref": "#/components/schemas/ResponsePlanCPADto"
            }
          },
          "required": [
            "withImprovements",
            "withoutImprovements"
          ]
        },
        "ResponsePlanDetailsDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ResponsePlanItemDto"
              }
            },
            "accountId": {
              "type": "number"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string"
            },
            "credits": {
              "$ref": "#/components/schemas/ResponsePlanCreditsDto"
            },
            "cpa": {
              "$ref": "#/components/schemas/ResponsePlanCPASummaryDto"
            }
          },
          "required": [
            "id",
            "name",
            "items",
            "accountId",
            "createdAt",
            "updatedAt",
            "credits",
            "cpa"
          ]
        },
        "ResponsePlanDeleteDto": {
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean"
            }
          },
          "required": [
            "success"
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
