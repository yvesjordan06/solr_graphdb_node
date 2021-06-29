import Router from "koa-router"
import { SearchRoutes, WikiRoutes } from "./search.js";

export const router = new Router();

router.get('/', (ctx) => { ctx.redirect("/search") },)
router.get('/enrich', (ctx) => {  return ctx.render('enrich')})
router.get('/meal', (ctx) => {  return ctx.render('meal-finder')})
router.get('/diet-planner', (ctx) => {  return ctx.render('diet')})

router.use(SearchRoutes())
router.use(WikiRoutes())

export function MainRouter() {
    return router.routes()
}