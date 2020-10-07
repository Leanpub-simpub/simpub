namespace :db do

  desc "更新書籍出版狀態"
  task update_publish_state: :environment do
    
    on_shelf = Book.where(publish_state: "on-shelf")
    off_shelf = Book.where(publish_state: "off-shelf")
    
    if on_shelf.count != 0 or off_shelf.count != 0
      puts "-" * 10
      
      puts "updating on_shelf string"
      on_shelf.each do |book|
        book.update(publish_state: "on_shelf")
        print "."
      end
      
      puts "updating off_shelf string"
      off_shelf.each do |book|
        book.update(publish_state: "on_shelf")
        print "."
      end

      puts "done!"
      puts "-" * 10
    else
      puts "出版狀態已全部更新"
    end
  end

end