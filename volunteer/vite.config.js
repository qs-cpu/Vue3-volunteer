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
        if (req.url.startsWith('/api/report/myOverview') && req.method === 'GET') {
          return sendJSON('scoreOverview.json')
        }
        if (req.url.startsWith('/api/report/rankList') && req.method === 'GET') {
          return sendJSON('rank.json')
        }
        if (req.url.startsWith('/api/actList') && req.method === 'GET') {
          return sendJSON('actList.json')
        }
        if (req.url.startsWith('/api/actDetails/details') && req.method === 'GET') {
          return sendJSON('actDetails.json')
        }
        if (req.url.startsWith('/api/actDetails/apply') && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
            try {
              const { id, isApplay } = JSON.parse(body)
              const activityId = parseInt(id, 10);
              const filePath = path.resolve(process.cwd(), 'mock/actList.json')
              
              const actListData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
              
              // 在列表中查找对应的活动
              const activityToUpdate = actListData.data.list.find(item => item.id === activityId);
              
              if (activityToUpdate) {
                // 根据 isApplay 的值更新活动状态
                // isApplay: true -> 申请，状态变为 1 (审核中)
                // isApplay: false -> 撤销，状态变回 0 (未申请)
                activityToUpdate.applyStatus = isApplay ? 1 : 0;
              }
              
              // 将更新后的数据写回文件
              fs.writeFileSync(filePath, JSON.stringify(actListData, null, 2))
              
              // 返回成功响应
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 0, msg: '操作成功' }))
            } catch (error) {
              console.error('更新活动状态失败:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 1, msg: '更新失败' }))
            }
          })
          return
        }
        if (req.url.startsWith('/api/myApplyList') && req.method === 'GET') {
          return sendJSON('myApplyList.json')
        }
        if (req.url.startsWith('/api/act/publisherList') && req.method === 'GET') {
          return sendJSON('publishers.json')
        }
        if (req.url.startsWith('/api/act/durationsList') && req.method === 'GET') {
          return sendJSON('durationList.json')
        }
        if (req.url.startsWith('/api/act/uploadService') && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
            try {
              const newActivityData = JSON.parse(body)
              const filePath = path.resolve(process.cwd(), 'mock/actList.json')
              
              // 1. 读取当前的活动列表
              const actListData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
              
              // 2. 生成新活动的ID
              const existingIds = actListData.data.list.map(item => item.id)
              const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 0
              
              // 3. 转换数据格式以匹配 actList.json 的结构
              const transformedActivity = {
                id: newId,
                title: newActivityData.content.substring(0, 15) + '...', // 使用服务内容的前15个字符作为标题
                content: newActivityData.content, // 保存完整的服务内容，供详情页使用
                startTime: newActivityData.date,
                endTime: newActivityData.date + (newActivityData.duration * 60 * 60 * 1000),
                place: newActivityData.publisher.text,
                publisher: newActivityData.publisher.text, // 保存活动来源，供详情页使用
                hour: newActivityData.duration, // 保存服务时长，供详情页使用
                total: '不限', // 表单中无此项，提供一个默认值
                isYourSchool: false,
                canApply: true,
                applyStatus: 1,
                actPic: (newActivityData.fileList && newActivityData.fileList[0]?.url) || './imgs/actImg.jpeg'
              }
              
              // 4. 将新活动添加到列表开头
              actListData.data.list.unshift(transformedActivity)
              
              // 5. 将更新后的数据写回文件
              fs.writeFileSync(filePath, JSON.stringify(actListData, null, 2))
              
              // 6. 返回成功响应
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 0, msg: '提交成功并已保存' }))
            } catch (error) {
              console.error('保存新活动失败:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 1, msg: '保存失败，服务器发生错误' }))
            }
          })
          return
        }
        if (req.url.startsWith('/api/service/userScore') && req.method === 'GET') {
          return sendJSON('userScore.json')
        }
        if (req.url.startsWith('/api/service/yearList') && req.method === 'GET') {
          return sendJSON('yearList.json')
        }
        if (req.url.startsWith('/api/service/yearScore') && req.method === 'GET') {
          return sendJSON('yearScore.json')
        }
        if (req.url.startsWith('/api/service/list') && req.method === 'GET') {
          return sendJSON('serviceList.json')
        }
        // 继续处理其他请求
        if (req.url.startsWith('/api/service/details') && req.method === 'GET') {
          return sendJSON('recordDetails.json')
        }
        next()
      })
    },
  }
}

// Vite配置
export default defineConfig({
  plugins: [vue(), mockPlugin()],
})