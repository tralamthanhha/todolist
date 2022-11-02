const Tasks=require('../models/Tasks')
const TaskAPI={
    update: async (data) => {
        return await Tasks.findByIdAndUpdate(id, {$set: data});
    },
    editAuthor:async(oldAuthor,newAuthor)=>{
        Tasks.find({author:oldAuthor})
        .then(tasks=>{
            tasks.author=newAuthor
            tasks.save()
        })
    },
}
module.exports = TaskAPI;