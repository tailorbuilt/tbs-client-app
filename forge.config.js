module.exports = {
      "packagerConfig": {
	  "icon": "src/resources/tailorbuilt_icon"
	},
      "publishers": [
        {
          "name": "@electron-forge/publisher-github",
          "config": {
            "repository": {
              "owner": "tailorbuilt",
              "name": "tbs-client-app"
            }
          }
        }
      ],
      "makers": [
        {
          "name": "@electron-forge/maker-squirrel",
          "config": {
            "name": "tbs_client_app"
          }
        },
        {
          "name": "@electron-forge/maker-zip",
          "platforms": [
            "darwin"
          ]
        },
        {
          "name": "@electron-forge/maker-deb",
          "config": {}
        },
        {
          "name": "@electron-forge/maker-rpm",
          "config": {}
        }
      ]
}
