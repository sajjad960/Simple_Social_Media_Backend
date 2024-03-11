import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Counter from "../models/counterModel";

const createOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: object = await Model.create(req.body);

    // send responce
    res.status(201).json({
      status: "success",
      data: {
        ...doc,
      },
    });
  });

const getAll = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Query Refactore
    let query: any = {};
    // Api Features
    function filter() {
      const queryObj = { ...req.query };
      const excludedFields = ["page", "sort", "limit", "fields", "include"];
      excludedFields.forEach((el) => delete queryObj[el]);
      query.where = queryObj;
    }
    function sort() {
      const sortedFields = req?.query?.sort ?? [["created_at", "DESC"]];
      query.order = sortedFields;
    }
    function limitedField() {
      const selectedFields = req?.query?.excludeFields ?? null;
      query.attributes = { exclude: selectedFields };
    }
    function paginate() {
      let limit: number = Number(req.query.limit) || 10;
      const page: number = Number(req.query.page) || 1;
      let offset = 0 + (page - 1) * limit;

      query.limit = limit;
      query.offset = offset;
    }

    function relationsData() {
      const includeArray: any[] = [];

      if (req.query.include) {
        const includedModels = String(req.query.include).split(",");

        includedModels.forEach((associationName: string) => {
          
          const model =
            (associationName === "postReactions" && Counter) ||
            (associationName === "commentReactions" && Counter) ||
            (associationName === "replyReactions" && Counter);

          includeArray.push({
            model: model,
            as: associationName,
          });
        });

        if (includeArray.length > 0) {
          query.include = includeArray;
        }
        console.log("query", query);
      }
    }

    // Call Api Features
    filter();
    limitedField();
    sort();
    paginate();
    relationsData();

    console.log(query);
    const { count, rows } = await Model.findAndCountAll(query);

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: rows?.length,
      data: rows,
      total: count,
    });
  });

const getOne = (Model: any, excludedfield: Array<String>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: object = await Model.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: excludedfield,
      },
    });

    // send responce
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

const factory = {
  createOne,
  getAll,
  getOne,
};
export = factory;
