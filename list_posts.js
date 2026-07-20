const { PrismaClient } = require("./app/generated/prisma");
const p = new PrismaClient();
p.blogPost.findMany({select:{id:true,slug:true,locale:true,title:true,category:true,templateId:true}}).then(r=>{console.log(JSON.stringify(r,null,2));p.$disconnect()});
