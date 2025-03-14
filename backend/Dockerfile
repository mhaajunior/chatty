# ใช้ Node.js เวอร์ชันที่ต้องการ
FROM node:18-alpine

# กำหนด working directory ใน container
WORKDIR /usr/src/app

# Copy ไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# Copy ไฟล์ทั้งหมดไปยัง container
COPY . .

# สร้างแอป (กรณีใช้ TypeScript)
RUN npm run build

# เปิด port ที่แอปจะใช้
EXPOSE 3000

# รันแอป Node.js
CMD [ "npm", "start" ]
