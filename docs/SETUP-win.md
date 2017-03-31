# electron-asazuke-sitescan のセットアップ（Windowsユーザー向け)

## 1. `phantomjs` と `casperjs` を展開します。

```
C:\phantomjs-2.1.1-windows
C:\casperjs-1.1.3
```

## 2. 管理者でコマンドプロンプトを開いて次のコマンドを叩きます。

```
SETX /M PATH "%PATH%;C:\phantomjs-2.1.1-windows\bin"
SETX /M PATH "%PATH%;C:\casperjs-1.1.3\bin"
```

## 3. `electron-asazuke-sitescan` のソースを配置します。

```
$ git clone https://github.com/pickles2/electron-asazuke-sitescan.git
$ cd electron-asazuke-sitescan
$ npm install
```
