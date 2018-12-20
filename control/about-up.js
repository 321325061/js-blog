exports.aboutInd = async (ctx) =>{
  await ctx.render('about-up' , {
    titles: "关于博主",
    // session: ctx.session
  })
}