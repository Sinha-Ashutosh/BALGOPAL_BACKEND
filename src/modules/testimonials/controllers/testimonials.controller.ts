import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler";
import { response } from "@/utils/response";
import { testimonialService } from "../services/testimonial.service";
import type {
  CreateTestimonialDto,
  GetTestimonialQueryDto,
  UpdateTestimonialDto,
} from "../validations/testimonial.validation";

const createTestimonial = asyncHandler(
  async (req: Request<object, object, CreateTestimonialDto>, res: Response) => {
    const testimonial = await testimonialService.createTestimonial(req.body, req.file);
    return response.success(res, { testimonial }, "Testimonial created successfully.", 201);
  }
);

const getTestimonials = asyncHandler(
  async (
    req: Request<object, object, object, GetTestimonialQueryDto>,
    res: Response
  ) => {
    const result = await testimonialService.getTestimonials(req.query);
    return response.success(res, result, "Testimonials fetched successfully.");
  }
);

const getPublicTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await testimonialService.getPublicTestimonials();
  return response.success(res, { testimonials }, "Testimonials fetched successfully.");
});

const updateTestimonial = asyncHandler(
  async (req: Request<{ id: string }, object, UpdateTestimonialDto>, res: Response) => {
    const testimonial = await testimonialService.updateTestimonial(
      req.params.id,
      req.body,
      req.file
    );
    return response.success(res, { testimonial }, "Testimonial updated successfully.");
  }
);

const deleteTestimonial = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  await testimonialService.deleteTestimonial(req.params.id);
  return response.success(res, null, "Testimonial deleted successfully.");
});

export const testimonialController = {
  createTestimonial,
  getTestimonials,
  getPublicTestimonials,
  updateTestimonial,
  deleteTestimonial,
};