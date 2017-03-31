# electron-asazuke-sitescanのセットアップ（Macユーザー向け)

### 目次
- homebrewをインストール
- nodejsをインストール
- phantomjsをインストール
- casperjsをインストール
- electron-asazuke-sitescanのセットアップ
- electron-asazuke-sitescanの起動＆実行

セットアップはすべてコマンドラインで行うのでまずはターミナルを立ち上げて下さい。
インストール済みのコマンドがある場合は読み飛ばしてください。

### １．アプリケーション > ユーティリティ > ターミナル.app を立ち上げます。

### ２．homebrewをインストールします。

  - 次のコマンドを実行してください。
```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

 - インストールされたバージョンの確認。あまり古いバージョンの場合はこのあとの処理が上手く行かない可能性があるので
  `brew doctor; brew update; brew upgrade;`を使いバージョンを上げて下さい。
```
$ brew -v
Homebrew 1.1.11
Homebrew/homebrew-core (git revision 6300; last commit 2017-03-14)
```

### ３．nodejsをインストール
```
$ brew install node
```

 - nodejsのバージョンの確認(npmはnodejsをインストールすると自動でインストールされます)  
   npmはnodeモジュールの扱うためのコマンドです。
```
$ node -v
v6.9.1
$ npm -v
3.10.8
```

### ４．phantomjsをインストール
```
$ brew install phantomjs
```
- phantomjsのバージョンの確認
```
$ phantomjs -v
2.1.1
```

### ５．casperjsをインストール
```
$ npm install -g casperjs
```
- casperjsのバージョンの確認
```
$ casperjs --version
1.1.3
```

### ６. electron-asazuke-sitescanのセットアップ
- gitを使いelectron-asazuke-sitescanのリポジトリをクローンします。(SourceTreeなどのアプリケーションで出来るひとはそちらをお使い下さい。)
```
$ git clone https://github.com/pickles2/electron-asazuke-sitescan.git
```
- クローンしたリポジトリに入り、npmモジュールをダウンロードします。
```
$ cd electron-asazuke-sitescan
$ npm install
```

- （オプション）electron-asazuke-sitescan内に作業ディレクトリを作ります。
  electron-asazuke-sitescan内に作業ディレクトリをつくることでこのアプリを使って行った作業が
  gitの管理対象に含まれるので動作が把握しやすくなります。
```
$ mkdir workspace
```

#### electron-asazuke-sitescanの起動&実行

 - electron-asazuke-sitescanの起動はコマンドラインから行います。
 electron-asazuke-sitescanクローンしたフォルダ内で実行してください。
```
$ npm start
```

 - アプリケーションが立ち上がりましたら
  - 情報を入力します。
  設定例）  
  出力ディレクトリ:/Users/(ユーザー名)/electron-asazuke-sitescan/workspace  
  URL：http://www.imjp.co.jp  
  UserAgent:Windows 10 64bit IE11 64bit': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; rv:11.0) like Gecko  
  viewport:XGA(1024x768)': '1024x768  

  - 「実行する」をクリックすると処理が開始されモーダルウィンドウが立ち上がります。(サイトスキャンを中断する場合はアプリ自体を終了させて下さい。アプリがおちると処理が中断されます。)

  #### モーダルウィンドウの説明
  - モーダルウィンドウの上部にあるプログレスバーは進捗率を表します（完了時にはCompleteのメッセージがでます。）
  - 中央に表示されるURLは解析済みのパスになります。（URLをクリックすることでブラウザでWEBページを確認することができます。）
  - 右上に表示される☓ボタンはモーダルを非表示にするボタンです。（サイトスキャンの停止ボタンではありません。）

### 次からは、electron-asazuke-sitescanのフォルダで`npm start`することで起動できるようになります。

 以上がelectron-asazuke-sitescanの使い方になります
