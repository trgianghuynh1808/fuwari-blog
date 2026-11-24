<%*
const title = await tp.system.prompt("Tên bài viết");
const slug = title
  .toLowerCase()
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/đ/g, "d")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
await tp.file.move(`/${slug}/index`);
-%>
---
title: "<% title %>"
published: <% tp.date.now("YYYY-MM-DD") %>
description: ""
image: ""
tags: []
category: ""
draft: true
---

<!--
CÚ PHÁP RIÊNG CỦA FUWARI (khối comment này không hiện trên site, xóa nếu không cần)

Ảnh (đặt ảnh cùng thư mục với index.md, đặt tên không dấu cách):
  ![mô tả](./ten-anh.png "chú thích hiện dưới ảnh")

Hộp chú thích (ưu tiên dạng này, Obsidian và site đều hiển thị):
  > [!NOTE]
  > Nội dung
  Các loại: NOTE | TIP | IMPORTANT | WARNING | CAUTION

  Dạng riêng của Fuwari (chỉ chạy trên site, có tiêu đề tùy chỉnh):
  :::tip[Tiêu đề tùy chỉnh]
  Nội dung
  :::

Thẻ GitHub repo:
  ::github{repo="owner/repo"}

Code block (Expressive Code):
  ```ts title="file.ts" {2,4-5}      -> đặt tên file, tô đậm dòng
  ```ts showLineNumbers              -> hiện số dòng
  ```ts collapse={1-5}               -> thu gọn các dòng 1-5
  Dòng diff: dùng ins={2} del={3} sau tên ngôn ngữ

Công thức toán:  $E=mc^2$  hoặc khối  $$ ... $$

Frontmatter:
  tags: [Tag 1, Tag 2]   (tag có dấu cách bị Obsidian gạch đỏ, nhưng build bình thường)
  image: "./thumbnail.jpg"  (ảnh bìa, cùng thư mục)
  draft: true -> bài nháp, đổi false khi muốn đăng
-->

