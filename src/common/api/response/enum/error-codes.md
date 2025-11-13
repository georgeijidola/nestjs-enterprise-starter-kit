# Error Code Reference

This document outlines essential error codes for the enterprise starter kit. All error codes use a consistent `E_<CODE>` format.

---

| Code                                    | Category      | Description                           |
| --------------------------------------- | ------------- | ------------------------------------- |
| **Auth Errors (E_1000–E_1099)**        |
| E_1001                                  | Auth          | Invalid credentials                   |
| E_1002                                  | Auth          | Token has expired                     |
| E_1003                                  | Auth          | Unauthorized operation                |
| E_1004                                  | Auth          | Email already exists                  |
| **User Errors (E_1100–E_1199)**        |
| E_1100                                  | User          | User not found                        |
| E_1101                                  | User          | User already exists                   |
| **Validation Errors (E_1400–E_1499)**  |
| E_1400                                  | Validation    | Validation error                      |
| E_1401                                  | Validation    | Missing required field                |
| **HTTP Errors (E_2000–E_2099)**        |
| E_2000                                  | HTTP          | Bad request                           |
| E_2001                                  | HTTP          | Unauthorized                          |
| E_2002                                  | HTTP          | Forbidden                             |
| E_2003                                  | HTTP          | Not found                             |
| E_2004                                  | HTTP          | Method not allowed                    |
| E_2005                                  | HTTP          | Conflict                              |
| E_2006                                  | HTTP          | Too many requests                     |
| E_2007                                  | HTTP          | Request timed out                     |
| E_2008                                  | HTTP          | Internal server error                 |
| E_2009                                  | HTTP          | Service unavailable                   |
| E_2010                                  | HTTP          | Unprocessable entity                  |
| **Database Errors (E_2100–E_2199)**    |
| E_2100                                  | Database      | Database connection failed            |
| E_2103                                  | Database      | Duplicate key violation               |
| E_2104                                  | Database      | Record not found                      |
| **Infrastructure Errors (E_3000+)**    |
| E_3100                                  | Queue         | Queue processing error                |
| E_3101                                  | Cache         | Cache access error                    |

---

## Notes

- All error codes follow the `E_<XXXX>` format to maintain uniformity across services.
- Numeric ranges are reserved per category to simplify filtering and troubleshooting.
- Prisma codes are directly mapped from official [Prisma error reference](https://www.prisma.io/docs/reference/api-reference/error-reference).
- HTTP-related codes match their corresponding status codes where applicable (e.g., `401 → E_2001`).
