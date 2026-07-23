# RESTful API 文章发布系统 — 技术使用说明与接口文档

本系统为技术人员与自动化程序提供标准的 RESTful API 接口，支持通过 HTTP 请求进行 **文章发布、配图在线/Base64上传、定时排期发布、板块分类绑定、样式模版关联** 及 **完整 SEO 属性配置**。

---

## 一、 快速开始与身份认证 (Authentication)

调用所有 API 接口均需要进行身份认证。系统支持以下两种 HTTP Header 认证方式：

### 1. HTTP 请求头格式
- **方式一（推荐）**：使用 `X-API-Key`
  ```http
  X-API-Key: igortv-api-secret-key-2026
  ```
- **方式二**：使用 `Authorization: Bearer`
  ```http
  Authorization: Bearer igortv-api-secret-key-2026
  ```

> 💡 **提示**：管理人员可在系统后台 **「系统设置」(`admin/settings`) $\rightarrow$ 「🔑 API 发布密钥设置」** 页面查看、任意修改或一键随机生成该 `X-API-Key` 密钥。亦可通过环境变量 `API_SECRET_KEY` 进行系统级覆盖。

---

## 二、 接口列表与参数详解

| 接口功能 | 请求方式 | 接口 URL | 说明 |
| :--- | :--- | :--- | :--- |
| **图片/配图上传** | `POST` | `/api/v1/upload` | 支持 Multipart 文件与 Base64 编码，返回可直接引用的图片 URL |
| **文章创建与发布** | `POST` | `/api/v1/posts` | 支持即时发布、定时排期发布、模版与板块绑定、SEO配置 |
| **文章列表查询** | `GET` | `/api/v1/posts` | 分页查询文章列表，支持按板块、语言、发布状态筛选 |
| **文章详情与修改** | `GET / PATCH / DELETE` | `/api/v1/posts/:id` | 按文章 ID 或 Slug 获取、修改更新或删除文章 |
| **查询系统板块** | `GET` | `/api/v1/categories` | 查询系统当前支持的所有板块分类列表及标识 |
| **查询可用模版** | `GET` | `/api/v1/templates` | 查询数据库中已配置的文章模版 ID 与名称 |

---

### 1. 配图上传接口 (`POST /api/v1/upload`)

配图上传接口支持两种常见数据格式：`multipart/form-data`（Form表单文件上传）与 `application/json`（Base64图像编码字符串）。

#### 选项 A: Form 表单上传 (`multipart/form-data`)
- **Headers**:
  ```http
  X-API-Key: <YOUR_API_KEY>
  ```
- **Body 参数**:
  - `file` (File, 必填): 图像文件（支持 PNG, JPG, WEBP, GIF 等，最大 10MB）。

#### 选项 B: Base64 JSON 上传 (`application/json`)
- **Headers**:
  ```http
  X-API-Key: <YOUR_API_KEY>
  Content-Type: application/json
  ```
- **JSON Body 参数**:
  - `base64` (String, 必填): 带有 Data URI 前缀的 Base64 字符串（如 `data:image/png;base64,...`）或纯 Base64 编码。
  - `filename` (String, 可选): 指定保存的原始文件名（如 `header-cover.jpg`）。

#### 响应结果示例:
```json
{
  "ok": true,
  "url": "/uploads/1753231200-a1b2c3d.png",
  "absoluteUrl": "https://igoriptv2.com/uploads/1753231200-a1b2c3d.png",
  "filename": "1753231200-a1b2c3d.png"
}
```
*可在后续文章正文 `content` 中使用 `<img src="/uploads/1753231200-a1b2c3d.png" />` 或完整 URL 进行配图插入。*

---

### 2. 文章创建与发布接口 (`POST /api/v1/posts`)

用于发布新文章、保存草稿或设置定时自动发布。

#### HTTP 请求:
```http
POST /api/v1/posts
X-API-Key: <YOUR_API_KEY>
Content-Type: application/json
```

#### 请求参数说明 (JSON Body):

| 参数名 | 类型 | 必填 | 默认值 | 详细说明与合法值范围 |
| :--- | :--- | :--- | :--- | :--- |
| `title` | String | **是** | - | 文章标题（如：`Guía Completa IPTV España 2026`） |
| `content` | String | **是** | - | 文章 HTML 格式正文（支持段落、标题 `<h2>`/`<h3>`、图片 `<img src="...">` 等） |
| `category` | String | **是** | `guias` | 发布的板块分类，合法值：<br>• `guias` (指南与教程)<br>• `dispositivos` (设备与硬件)<br>• `contenido` (内容与频道)<br>• `comparativas` (对比与评测) |
| `status` | String | 否 | `published` | 发布状态，合法值：<br>• `published` (立即发布公开)<br>• `draft` (保存为草稿)<br>• `scheduled` (定时排期发布) |
| `publishAt` | String | 定时发布时必填 | 当年前时间 | ISO 8601 格式时间戳（如 `2026-08-01T10:00:00.000Z`）。若 `status="scheduled"`，文章将在到达该时间后前台自动上线 |
| `slug` | String | 否 | 标题自动转化 | 自定义 URL Slug（如 `guia-completa-iptv-2026`）。不填时自动根据标题转为小写横杠连接 |
| `locale` | String | 否 | `es` | 语言标识（如 `es`, `fr`, `en`, `zh`） |
| `templateName` | String | 否 | - | 绑定的模版名称（如 `"Standard SEO T"`）。绑定后自动应用模版页头/页脚、关键词自动内链及推荐规则 |
| `templateId` | String | 否 | - | 绑定的模版 ID（与 `templateName` 二选一） |
| `excerpt` | String | 否 | 正文自动提取 | 文章摘要说明 |
| `metaTitle` | String | 否 | 取 `title` 替换 | SEO 搜索标题（显示在浏览器标签页及搜索引擎搜索结果页） |
| `metaDescription` | String | 否 | 取 `excerpt` | SEO 搜索描述（建议 120-160 个字符） |
| `keywords` | String / Array | 否 | `""` | SEO 关键词，支持数组 `["IPTV", "España"]` 或逗号分隔字符串 `"IPTV, España"` |
| `canonicalUrl` | String | 否 | 动态生成 | 自定义 Canonical 规范 URL |
| `robots` | String | 否 | `index, follow` | 搜索引擎爬虫指令（如 `index, follow` 或 `noindex, nofollow`） |
| `anchorNavEnabled`| Boolean | 否 | `true` | 是否启用文章右侧/移动端目录导航栏 (TOC) |

#### 完整请求 JSON 示例 (定时排期发布 + 配图 + 绑定模版):
```json
{
  "title": "Cómo Instalar y Usar IPTV en Smart TV Samsung 2026",
  "slug": "instalar-iptv-smart-tv-samsung-2026",
  "locale": "es",
  "category": "dispositivos",
  "status": "scheduled",
  "publishAt": "2026-08-10T08:00:00.000Z",
  "templateName": "Standard SEO T",
  "content": "<h2>1. Introducción</h2><p>Aprende a configurar tu Smart TV Samsung en minutos.</p><p><img src=\"/uploads/1753231200-cover.jpg\" alt=\"Smart TV IPTV\" /></p><h2>2. Pasos de Instalación</h2><p>Descarga la aplicación oficial desde la tienda de Samsung...</p>",
  "excerpt": "Guía paso a paso para instalar y configurar listas IPTV en televisores Samsung Smart TV.",
  "metaTitle": "IPTV en Smart TV Samsung: Guía de Instalación 2026",
  "metaDescription": "Descubre cómo configurar tu Smart TV Samsung para ver canales IPTV con la mejor calidad HD y 4K.",
  "keywords": ["IPTV Samsung", "Smart TV IPTV", "Guía 2026"],
  "anchorNavEnabled": true
}
```

#### 成功响应示例:
```json
{
  "ok": true,
  "message": "Article scheduled successfully",
  "post": {
    "id": "cmrkyuqop000847h2pocmyand",
    "title": "Cómo Instalar y Usar IPTV en Smart TV Samsung 2026",
    "slug": "instalar-iptv-smart-tv-samsung-2026",
    "locale": "es",
    "category": "dispositivos",
    "status": "scheduled",
    "publishAt": "2026-08-10T08:00:00.000Z",
    "createdAt": "2026-07-23T00:35:00.000Z"
  },
  "url": "/es/blog/instalar-iptv-smart-tv-samsung-2026",
  "absoluteUrl": "https://igoriptv2.com/es/blog/instalar-iptv-smart-tv-samsung-2026"
}
```

---

### 3. 文章查询列表接口 (`GET /api/v1/posts`)

用于技术人员拉取或同步当前文章列表。

#### 查询参数 (Query Parameters):
- `locale` (可选): 按语言过滤（如 `locale=es`）。
- `category` (可选): 按板块过滤（如 `category=guias`）。
- `status` (可选): 按状态过滤 (`published` / `draft` / `scheduled`)。
- `page` (可选): 页码，默认 `1`。
- `limit` (可选): 每页条数，默认 `20`，最大 `100`。

---

### 4. 板块与模版查询接口

#### GET `/api/v1/categories` (获取可选板块)
返回系统当前支持的全部板块分类标识、多语言名称及描述。

#### GET `/api/v1/templates` (获取可用模版)
返回可选模版的清单：
```json
{
  "ok": true,
  "templates": [
    {
      "id": "cmrkyuqop000847h2pocmyand",
      "name": "Standard SEO T",
      "isDefault": true,
      "anchorNavEnabled": true,
      "recommendationsType": "latest",
      "recommendationsCount": 3
    }
  ]
}
```

---

## 三、 代码调用示例 (Code Examples)

### 1. cURL (命令行)

#### 上传配图并发布文章：
```bash
# 1. 上传配图
curl -X POST https://igoriptv2.com/api/v1/upload \
  -H "X-API-Key: igortv-api-secret-key-2026" \
  -F "file=@/path/to/local/cover.jpg"

# 2. 发布文章
curl -X POST https://igoriptv2.com/api/v1/posts \
  -H "X-API-Key: igortv-api-secret-key-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mejores Aplicaciones IPTV para Firestick 2026",
    "category": "dispositivos",
    "status": "published",
    "templateName": "Standard SEO T",
    "content": "<h2>Las Mejores Apps</h2><p>Lista de aplicaciones probadas.</p>",
    "excerpt": "Descubre las mejores aplicaciones IPTV para tu Firestick.",
    "keywords": ["Firestick IPTV", "Apps IPTV"]
  }'
```

### 2. Python 自动化脚本示例

```python
import requests

API_KEY = "igortv-api-secret-key-2026"
BASE_URL = "https://igoriptv2.com/api/v1"
HEADERS = {"X-API-Key": API_KEY}

# Step 1: 上传配图
with open("banner.png", "rb") as f:
    upload_res = requests.post(
        f"{BASE_URL}/upload",
        headers=HEADERS,
        files={"file": ("banner.png", f, "image/png")}
    ).json()

image_url = upload_res["url"]
print("配图上传成功:", image_url)

# Step 2: 定时发布文章
post_payload = {
    "title": "Guía de IPTV en Android Box 2026",
    "category": "dispositivos",
    "status": "scheduled",
    "publishAt": "2026-08-05T10:00:00Z",
    "templateName": "Standard SEO T",
    "content": f"""
        <h2>Configuración en Android Box</h2>
        <p>Aprende a configurar tu dispositivo Android Box fácilmente.</p>
        <p><img src="{image_url}" alt="Android Box IPTV" /></p>
    """,
    "excerpt": "Tutorial para instalar IPTV en dispositivos Android Box.",
    "keywords": ["Android Box", "IPTV Guía"]
}

publish_res = requests.post(
    f"{BASE_URL}/posts",
    headers=HEADERS,
    json=post_payload
).json()

print("文章请求响应:", publish_res)
```

### 3. Node.js / JavaScript (fetch) 示例

```javascript
const API_KEY = 'igortv-api-secret-key-2026';
const BASE_URL = 'https://igoriptv2.com/api/v1';

async function publishArticle() {
  // 1. 发布文章
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Comprar Suscripción IPTV España: Consejos Útiles',
      category: 'guias',
      status: 'published',
      templateName: 'Standard SEO T',
      content: '<h2>Consejos antes de contratar IPTV</h2><p>Evita estafas con estos consejos...</p>',
      excerpt: 'Descubre en qué fijarte antes de comprar una suscripción IPTV.',
      metaTitle: 'Consejos para Comprar IPTV en España 2026',
      keywords: ['Comprar IPTV', 'Suscripción IPTV']
    })
  });

  const data = await res.json();
  console.log('发布结果:', data);
}

publishArticle();
```
