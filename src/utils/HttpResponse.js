export class HttpResponse {
  static Paginate(data) {
    return {
      status: "success",
      code: 200,
      message: "Lấy dữ liệu thành công.",
      data,
    };
  }

  static created(data) {
    return {
      status: "success",
      code: 201,
      message: "Dữ liệu đã được tạo thành công.",
      data,
    };
  }

  static error(errors) {
    return {
      status: "error",
      code: 400,
      message: "Dữ liệu không hợp lệ.",
      error_code: "ERR123456",
      errors,
    };
  }

  static updated(data) {
    return {
      status: "success",
      code: 200,
      message: "Dữ liệu đã được cập nhật thành công.",
      data,
    };
  }

  static count(count) {
    return {
      status: "success",
      code: 200,
      message: "Điếm số lượng dữ liệu thành công.",
      data: {
        count,
      },
    };
  }

  static detail(data) {
    return {
      status: "success",
      code: 200,
      message: "Lấy dữ liệu thành công.",
      data,
    };
  }

  static success(data) {
    return {
      status: "success",
      code: 200,
      message: "Thao tác thành công.",
      data,
    };
  }

  static notFound(mesage = "Không tìm thấy dữ liệu") {
    return {
      status: "not-found",
      code: 404,
      mesage,
      error_code: "NOT_FOUND",
    };
  }
}
