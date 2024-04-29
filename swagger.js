const swaggerJSDoc = require('swagger-jsdoc') //for swagger
const swaggerUi = require('swagger-ui-express') //for swagger
const options={
	definition:{
		openapi:'3.0.0',
		info:{
			title:'Node Js Project',
			version: '1.0.0'
		},
		servers:[{

			url: 'http://localhost:3000/'
		}

		]
	},
	apis:['./server.js']
}

const swaggerspec = swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerspec))