import * as Koa from "koa";
import * as logger from "koa-logger";
import * as Router from "koa-router";
import users from "./db/db";
import { Greater, InterfaceUser } from "./greater";
import { InterfacePerson } from "./interfaces";
import { makeHTML } from "./myEngine";

const router = new Router();
const server = new Koa();

server.use(logger());

router.get("/", async ctx => {
    const response: InterfacePerson[] = await users.users.find({});
    ctx.body = makeHTML(response);
});

router.get("/great", async ctx => {
    const response: InterfacePerson[] = await users.users.find({}).select("name");
    const data: string[] = [];
    response.forEach(item => {
        const name = item.name;
        const greated = new Greater(name);
        data.push(greated.great());
    });
    const wrongGreatedPerson = new Greater(undefined);
    data.push(wrongGreatedPerson.great());
    ctx.body = data.reduce((a, x) => {
        return a + x + "\n";
    }, "");
});

server.use(router.routes()).listen(3000);
