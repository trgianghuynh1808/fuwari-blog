---
title: "Scrumban Process - Phần 1: Giới thiệu"
published: 2025-08-17
description: "Xu hướng mới trong quy trình phát triển phần mềm ..."
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

### A. Kế thừa các yếu tố từ Scrum

* **Sprint:**
    * <u>Với Scrum:</u> một Sprint sẽ kéo dài từ *2-4 tuần*, phụ thuộc vào quy mô của mục tiêu trong Sprint.
    * <u>Với Scrumban:</u> thời gian của Sprint hoặc là Iteration sẽ ngắn hơn *(2 tuần)*. Thời gian Sprint sẽ được fixed, không push thêm ticket khi chưa hoàn thành. Điều này nhằm đảm bảo target Continuos Delivery.
* **Daily Standup:** thời lượng < 10 phút. Team sẽ xoay quanh 3 câu hỏi: Đã hoàn thành chi? Đang thực hiện chi? Có trở ngại chi không?
* **Sprint Planning:** xác định rõ target của Sprint và lượng ticket phù hợp với Sprint time.
    * <u>Với Scrum:</u> planning phase nhằm đưa ra estimate time cần thiết cho target, từ đó lựa chọn Sprint time phù hợp.
    * <u>Với Scrumban:</u> trong planning phase cần chốt được số lượng ticket có thể done trong Iteration với một fixed time. \
    *=> Tăng độ chính xác của estimate time vì chỉ plan trong khoảng thời gian đủ nhỏ.*
* **Role (optional):** Scrumban sẽ không chia nhiều vai trò, thông thường sẽ có: Dev Team, Project Manager (optional). Vai trò của PM trong Scrumban giúp target đề ra sát với nhu cầu của project nhất.
* **Retrospective (optional):** thông thường retro sẽ được thực hiện vào cuối mỗi end sprint. Tuy nhiên, kinh nghiệm của mình với tần suất retro như vậy, hầu như chỉ có thể cải thiện nhanh những vấn đề nhỏ lẻ của Sprint. Đa phần với phát triển phần mềm, mình thấy issue cốt lỗi nằm ở yếu tố con người là chính và việc này không thể thay đổi nhanh được. Cá nhân mình suggest tần suất khoảng 2-3 Sprint/lần.


### B. Kế thừa các yếu tố từ Kanban

* **Kanban board:** Scrumban kế thừa Visualize Work của Kanban, có thể tổng quát hóa quy trình làm việc với các trạng thái dễ hình dung hơn (không thuần technical),
* **Pull system:** Lượng ticket được đẩy vô board sẽ phù hợp với dung lượng có thể chứa hơn là pull nhiều nhất có thể.

:::important
Với mình, việc team có control được lượng work load hoặc development process có smooth hay không. Phụ thuộc rất nhiều vào mindset của người control (với Scrum là Scrum Master, Scrumban là Project Management) \
Không chỉ đơn thuần là đưa ra quyết định những gì sẽ thực hiện trong Sprint, người control cần hiểu được khó khăn mà team đang gặp phải, ngữ cảnh của Sprint, cùng với những thay đổi liên tục trong quá trình vận hành để có thể take action đúng lúc. \
**Sứ mệnh của người control là giúp cho quá trình vận hành được suôn sẻ nhất có thể và giảm thiếu áp lực cho các bên.**
:::

* **Work-in-progress (WIP) limit**: set limit progress ở từng phase, vì Kanban là visualize quy trình sản suất -> các trạng thái của ticket sẽ được đảm nhiệm ở từng vai trò. Khi số lượng ticket ở vai trò đó quá nhiều, sẽ gây hiện tượng nghẹn cổ chai. Về lâu dài sẽ ảnh hưởng tới mental health của member.

* **Continuous workflow**: với Scrum cần hoàn thành hết các ticket trong Sprint, Scrumban cho phép quy trình được thực thi liên tục. Nghĩa là, khi kết thúc Sprint không buộc toàn bộ ticket phải đi hết tới quy trình cuối cùng. Có thể ở Sprint đó vẫn còn một số Ticket đang chờ delivery...

* **Focus on cycle time**: mục tiêu hướng tới của Kanban, không phải là hoàn thành nhiều ticket, cũng không phải là hoàn thành target đề ra. Mà là tối ưu cycle time (thời gian ticket được lên plan -> delivery). Nói nôm na là tối ưu từng quy trình sản suất. Từ đó dễ dàng đạt được target hơn, giảm tải áp lực thực thi hơn.

### C. Overview

| Loại | Scrum | Kanban | Scrumban |
|----------|-------|--------|----------|
| **Cách tiếp cận** | Nghiêm ngặt | Linh hoạt và thoải mái | Cân bằng |
| **Vai trò** | Vai trò được định nghĩa: Product owner, Scrum master, Development team | Không có vai trò định sẵn, nhưng nhiều team có project manager | Không có vai trò định sẵn, nhưng thường có project manager |
| **Chu kỳ/thời gian** | Sprint cố định, thường kéo dài 2-4 tuần | Quy trình làm việc liên tục không có vòng lặp cố định | Chu kỳ làm việc ngắn, gọi là iterations, kéo dài tối đa 2 tuần |
| **Quản lý công việc** | Hệ thống đẩy: công việc được giao cho thành viên team | Hệ thống kéo: thành viên tự chọn công việc | Hệ thống kết hợp: Project manager đẩy công việc vào cột To-Do, nhưng thành viên team kéo công việc từ đó |
| **Chỉ số hiệu suất** | Velocity | Cycle time | Average cycle time |

> Ở part 2, mình sẽ chia sẻ về cách thực thi Scrumban, những lưu ý trong quá trình vận hành và ưu/khuyết điểm của quy trình này. See u ^^~.

