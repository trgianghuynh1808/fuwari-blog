---
title: "Scrumban Process - Phần 1: Giới thiệu"
published: 2025-08-17
description: "Xu hướng mới trong quy trình phát triển phần mềm, với team size vừa và nhỏ..."
image: "./scrum-ban.jpg"
tags: [Scrumban, Development Process]
category: Project Management
draft: true
---

:::note[Series]
Mình sẽ chia thành nhiều phần, để mọi người dễ đọc hơn. Series sẽ bao gồm:
* [Phần 1: giới thiệu các yếu tố của Scrumban.](/posts/scrum-ban-part-1)
* [Phần 2 (coming soon): Scrumban workflow và các yếu tố có thể ảnh hưởng trong quá trình vận hành.](#)
* [Phần 3 (coming soon): Self host Scrumban với WeKan](#)
:::

> Là một Scrum Master, trong quá trình vận hành với team size nhỏ (~5 members). Mình nhận thấy rằng, với các mô hình phát triển phần mềm truyền thống như (Kanban, Waterfall, Scrum...) chưa hoàn toàn phù hợp.\
> Thỉ dụ, với **Scrum**:
> * Vì team size nhỏ + Scrum cần có đủ các Role như: Scrum Master, Product Owner, Development Team. Gây overlapped role (mỗi người đảm nhiệm nhiều vai trò).
> * Khó lựa chọn Sprint Time phù hợp, với chu kỳ quá nhỏ resource không đủ để hoàn thành kịp một tính năng hoàn thiện và ngược lại với chu kỳ quá dài sẽ không phù hợp với định hướng Continuos Delivery.
> * Tốn thời gian không cần thiết với các Scrum Meeting (Daily, Start Sprint, End Sprint, Retrospective) target chung của Scrum Meeting nhầm đảm báo tính minh bạch (Transparency) nhưng với team size nhỏ việc này có thể dễ dàng thực hiện mà không cần quá nhiều meeting.

## Vậy Scrumban là gì?
Scrumban kết hợp những đặc điểm nổi bật của Scrum và Kanban thành một hybrid project management framework (mọi người có thể overview trước dựa theo banner của bài viết).

### Các yếu tố từ Scrum:

* **Sprint**:
    * Với Scrum: một Sprint sẽ kéo dài từ *2-4 tuần*, phụ thuộc vào quy mô của mục tiêu trong Sprint.
    * Với Scrumban: thời gian của Sprint hoặc là Iteration sẽ ngắn hơn *(2 tuần)*. Thời gian Sprint sẽ được fixed, không push thêm ticket khi chưa hoàn thành. Điều này nhằm đảm bảo target Continuos Delivery.
* **Daily Standup**: thời lượng < 10 phút. Team sẽ xoay quanh 3 câu hỏi: Đã hoàn thành chi? Đang thực hiện chi? Có trở ngại chi không?
* **Sprint Planning**: xác định rõ target của Sprint và lượng ticket phù hợp với Sprint time.
* **Role (optional)**: với Scrumban sẽ không chia nhiều vai trò, thông thường sẽ có: Dev Team, Project Manager.
* **Retrospective (optional)**: về lý thuyết thường retro sẽ được thực hiện vào cuối mỗi end sprint. Tuy nhiên, kinh nghiệm của mình với chu kỳ retro như vậy, hầu như chỉ có thể cải thiện nhanh những vấn đề nhỏ lẻ của Sprint. Đa phần với phát triển phần mềm, mình thấy issue cốt lỗi nằm ở yếu tố con người là chính. Và việc này không thể thay đổi nhanh được. Cá nhân mình suggest, chu kỳ khoảng 2-3 Sprint/lần.
