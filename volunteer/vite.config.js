import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// 自定义mock插件
function mockPlugin() {
  return {
    name: 'simple-mock-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 发送JSON文件的辅助函数
        const sendJSON = (file) => {
          const filePath = path.resolve(process.cwd(), `mock/${file}`)
          
          // 检查文件是否存在
          if (!fs.existsSync(filePath)) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ 
              error: `Mock file not found: ${file}` 
            }))
          }
          
          // 读取并返回JSON文件内容
          const json = fs.readFileSync(filePath, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(json)
        }

        // 拦截特定API请求
        if (req.url === '/api/studentList' && req.method === 'GET') {
          return sendJSON('data.json')
        }
        if (req.url === '/api/userInfo' && req.method === 'GET') {
          return sendJSON('userInfo.json')
        }
        // 继续处理其他请求
        next()
      })
    },
  }
}

// Vite配置
export default defineConfig({
  plugins: [vue(), mockPlugin()],
})