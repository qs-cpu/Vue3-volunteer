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
        if (req.url === '/api/actList' && req.method === 'GET') {
          return sendJSON('actList.json')
        }
        // 处理POST请求，直接修改userInfo.json
        if (req.url === '/api/userInfo/submit' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
            try {
              const userData = JSON.parse(body)
              const filePath = path.resolve(process.cwd(), 'mock/userInfo.json')
              
              // 读取当前userInfo.json文件
              const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
              
              // 更新数据（保留avatar字段）
              currentData.data = {
                ...currentData.data,
                ...userData,
                avatar: currentData.data.avatar // 保留头像字段
              }
              
              // 写回文件
              fs.writeFileSync(filePath, JSON.stringify(currentData, null, 4))
              
              // 返回成功响应
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 0, msg: '更新成功' }))
            } catch (error) {
              console.error('更新userInfo.json失败:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 1, msg: '更新失败' }))
            }
          })
          return
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