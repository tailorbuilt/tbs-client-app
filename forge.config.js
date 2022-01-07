module.exports = {
      "packagerConfig": {
	  "icon": "src/resources/tailorbuilt_icon"
	},
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
