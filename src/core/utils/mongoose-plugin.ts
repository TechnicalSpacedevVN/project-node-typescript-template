import mongoose from "mongoose";
import { paginate } from "./mongoose-paginate";
import { initSoftDeletePlugin } from "./mongoose-soft-delete";

mongoose.plugin(initSoftDeletePlugin);

(mongoose.Model as any).paginate = paginate;
