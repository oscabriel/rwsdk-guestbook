import { defineApp } from "rwsdk/worker";
import { route, render } from "rwsdk/router";
import { Document } from "@/app/document/Document";
import { Home } from "@/app/pages/home";
import { setCommonHeaders } from "@/app/document/headers";

export default defineApp([
  setCommonHeaders(),

  render(Document, [
    route("/", Home),
  ]),
]);
