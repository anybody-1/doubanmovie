var Helpers = {
    isToBottom: function($viewport, $content) {
        return $viewport.height() + $viewport.scrollTop() + 30 > $content.height()

    },
    createNode: function(subject){
        var $node = $('<div class="item">\
                    <a href="#">\
                        <div class="cover">\
                            <img src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1910813120.webp" alt="">\
                        </div>\
                        <div class="detail">\
                            <h2>霸王别姬</h2>\
                            <div class="extra"><span class="score"></span> / <span class="collection"></span>收藏</div>\
                            <div class="extra"></div>\
                            <div class="extra"></div>\
                            <div class="extra"></div>\
                        </div>\
                    </a>\
                </div>')
        $node.find('a').attr('href', subject.alt)
        $node.find('.cover img').attr('src', subject.images.small)
        $node.find('.detail h2').text(subject.title)
        $node.find('.detail .score').text(subject.rating.average)
        $node.find('.detail .collection').text(subject.collect_count)
        $node.find('.detail .extra').eq(1).text(subject.year + ' / ' + subject.genres.join('、'))
        $node.find('.detail .extra').eq(2).text('导演：' + subject.directors.map(v=>v.name).join('、'))
        $node.find('.detail .extra').eq(3).text('主演：' + subject.casts.map(v=>v.name).join('、'))
        return $node
    }
}

var Paging = {
    init: function(){
        this.$tabs = $('footer>div')
        this.$pages = $('main>section')
        this.bind()
    },
    bind: function(){
        var _this = this
        this.$tabs.on('click', function(){
            var $this = $(this)
            var index = $this.index()
            $this.addClass('active').siblings().removeClass('active')
            _this.$pages.eq(index).fadeIn().siblings().fadeOut()
        })
    }
}

var Top250 = {
    init: function(){
        var _this = this
        this.$container = $('#top250')
        this.$content = this.$container.find('.container')
        this.page = 0
        this.isFinished = false
        this.isLoading = false
        this.count = 10
        this.bind()
        this.getData(function(data){
            _this.renderData(data)
            _this.page++
        })
    },
    bind: function(){
        var _this = this
        this.$container.on('scroll', function(){
            if(Helpers.isToBottom(_this.$container, _this.$content) && !_this.isFinished && !_this.isLoading){
                _this.getData(function(data){
                    _this.renderData(data)
                    _this.page++
                    if(_this.page * _this.count > data.total){
                        _this.isFinished = true
                    }
                })
            }
        })
    },
    getData: function(callback){
        var _this = this
        this.isLoading = true
        this.$container.find('.loading').show(400)
        $.ajax({
            url: 'https://api.douban.com/v2/movie/top250',
            data: {
                start: this.count * this.page ,
                count: this.count
            },
            dataType: 'jsonp'
        }).done(function(ret){
            _this.isLoading = false
            _this.$container.find('.loading').hide()
            callback(ret)
        })
    },
    renderData: function(data){
        var _this = this
        data.subjects.forEach(function(item){
            var $node = Helpers.createNode(item)
        _this.$content.append($node)
    })
        
    }
}



var UsBoard = {
    init: function(){
        var _this = this
        this.$container = $('#beimei')
        this.$content = this.$container.find('.container')
        this.page = 0
        this.isFinished = false
        this.isLoading = false
        this.count = 10
        this.getData(function(data){
            _this.renderData(data)
            _this.page++
        })
    },
    getData: function(callback){
        var _this = this
        this.isLoading = true
        $.ajax({
            url: 'https://api.douban.com/v2/movie/us_box',
            data: {
                start: this.count * this.page ,
                count: this.count
            },
            dataType: 'jsonp'
        }).done(function(ret){
            _this.isLoading = false
            callback(ret)
        })
    },
    renderData: function(data){
        var _this = this
        data.subjects.forEach(function(item){
            var $node = Helpers.createNode(item.subject)
        _this.$content.append($node)
    })     
    }
}

var Search = {
    init: function(){
        this.$container = $('#search')
        this.$content = this.$container.find('.container')
        this.page = 0
        this.isFinished = false
        this.isLoading = false
        this.count = 10
        this.bind()
    },
    bind: function(){
        var _this = this
        this.$container.on('scroll', function(){
            if(Helpers.isToBottom(_this.$container, _this.$container.find('.wrap')) && !_this.isFinished && !_this.isLoading){
                _this.getData(function(data){
                    _this.renderData(data)
                    _this.page++
                    if(_this.page * _this.count > data.total){
                        _this.isFinished = true
                    }
                })
            }
        })
        this.$container.find('.search-area .button').on('click', function(){
            _this.$container.find('.container .item').remove()
            _this.getData(function(data){
                _this.renderData(data)
            })
        })
        this.$container.find('.search-area input').on('keyup', function(e){
            if(e.key === 'Enter') {
                _this.$container.find('.container .item').remove()
                _this.getData(function(data){
                    _this.renderData(data)
                })
            }
        })
    },
    getData: function(callback){
        var _this = this
        var keyword = _this.$container.find('.search-area input').val()
        this.isLoading = true
        this.$container.find('.loading').show(100)
        $.ajax({
            url: 'https://api.douban.com/v2/movie/search',
            data: {
                q: keyword
            },
            dataType: 'jsonp'
        }).done(function(ret){
            _this.isLoading = false
            _this.$container.find('.loading').hide()
            callback(ret)
        })
    },
    renderData: function(data){
        var _this = this
        data.subjects.forEach(function(item){
            var $node = Helpers.createNode(item)
            _this.$content.append($node)
    })
    }
}
var  App = {
    init: function(){
        Paging.init()
        Top250.init()
        UsBoard.init()
        Search.init()
    }
}

App.init()