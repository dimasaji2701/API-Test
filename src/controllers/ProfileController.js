const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const addProfile = async(req, res) => {
    try{
        const id = req.user['id']
        const bio = req.body['bio']

        const addBio = await prisma.profile.create({
            data:{
                bio: bio,
                userId: id
            }
        })
        res.status(201).json({
            message: 'Successfully',
            data: addBio
        })
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
}

const getMyProfile = async(req, res) => {
    try {
        const id = req.user.id
        const myProfile = await prisma.user.findMany({
            where:{
                id: id
            },
            select:{
                id: true,
                name: true,
                profile:{
                    select:{
                        bio: true
                    },where:{
                        userId: id
                    }
                },
                posts:{
                    select:{
                        title: true,
                        content: true
                    },where: {
                        authorId : id
                    }
                }
            }
        })
        res.status(200).json({
            message: 'successfully',
            data: myProfile
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

const addPost = async (req, res) => {
    try {
        const id = req.user['id']
        const title = req.body['title']
        const content = req.body['content']
        console.log(id)

        const post = await prisma.post.create({
            data:{
                updatedAt: new Date(),
                title: title,
                content: content,
                published: true,
                authorId: id
            }
        })
        res.status(201).json({
            message: 'Successfully',
            data: post
        })
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

module.exports = {
    addProfile,
    getMyProfile,
    addPost
}