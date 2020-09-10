# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

50.times do
  name = Faker::Name.name
  
  user = User.create(email: Faker::Internet.unique.email, password: "123456", name: name, username: name.downcase.gsub(/[^a-z0-9]+/,''))

  book = Book.create(title: Faker::Book.title, price: rand(50), publish_state: "on-shelf")
  
  book.book_authors.create(user: user, book: book)
end
