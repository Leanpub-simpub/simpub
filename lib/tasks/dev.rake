namespace :dev do

  desc "Rebuild system"
  # `$ rake dev:rebuild` 會重新建立資料庫
  task rebuild: ["db:drop", "db:create", "db:migrate", :fake]

  # `$ rake dev:fake` 會依據 `users_limit` 數字建立固定數量的假資料
  task fake: :environment do
    puts "-" * 20
    puts "開始建立開發用假資料"

    users_limit = 50

    (users_limit - User.count).times do
      name = Faker::Name.name
      
      user = User.new(
        email: Faker::Internet.unique.email,
        password: "123456",
        name: name,
        username: name.downcase.gsub(/[^a-z0-9]+/,''),
        as_author: true
        )
      # 下面這行打開會自動將假圖上傳至 S3，請慎用
      user.avatar_remote_url = Faker::LoremFlickr.image(search_terms: ["people"])
      user.save!
      
      book = Book.new
      book.title = Faker::Book.unique.title
      book.price = rand(50)
      book.publish_state = "on-shelf"
      # 下面這行打開會自動將假圖上傳至 S3，請慎用
      book.cover_remote_url = Faker::LoremFlickr.image
      
      user.pub_books << book if book.save!
      book.tags.create(name: Faker::Book.genre)

      print "."
    end

    puts "資料建立完成!"
    puts "-" * 20
  end

end