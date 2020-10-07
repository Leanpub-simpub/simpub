namespace :db do

  desc "更新書名 slug"
  task update_book_slug: :environment do
    
    slug_nil = Book.where(slug: nil)
    
    if slug_nil.count != 0
      puts "-" * 10
      puts "updating slug"

      slug_nil.each do |book|
        book.update(slug: update_slug(book.title))
        print "."
      end

      puts "done!"
    puts "-" * 10
    else
      puts "Book slug 已全部更新"
    end

  end


  private
  def update_slug(title)
    title.gsub(/[\+\#]/, "+" => "p", "#" => "sharp").parameterize
  end

end