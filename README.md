# Nouhin

Nouhin is a CLI tool that supports diff delivery.

## Installation

```sh
$ npm install -g nouhin
```

## Usage

Firstly, run `nouhin` command on your git project.

```sh
$ ls -A
.git	bar.txt	baz.txt	foo.txt

$ nouhin
```

Then Nouhin will do the following jobs:

* Copying all files into `.nouhin` directory.
* Generating `(current date).zip` which contains the files under `.nouhin`.
* Committing the changes for `.nouhin` directory.

```sh
$ ls -A
.git		.nouhin		20180611.zip	bar.txt		baz.txt		foo.txt

$ unzip -lqq 20180611.zip
        4  06-11-2018 07:56   ./bar.txt
        4  06-11-2018 07:56   ./baz.txt
        4  06-11-2018 07:56   ./foo.txt
```

After that, edit and commit any files in your project and run `nouhin` again. Nouhin works as same as previously but generates a new zip file that only has updated files.

```sh
$ rm 20180611.zip
$ echo "Updated" > bar.txt
$ git add bar.txt && git commit -m "update bar"
$ nouhin

$ unzip -lqq 20180611.zip
        8  06-11-2018 08:00   ./bar.txt
```

## Options

| name                | description                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `--source` (`-s`)   | Path to the directory that contains source codes. It may be a directory having built files when you use any build process. (default `.`) |
| `--delivery` (`-d`) | Path to the directory that contains delivered files which diffs are managed by git. (default `.nouhin`)                                  |
| `--output` (`-o`)   | File name of output zip file. (default `{yyyymmdd}.zip`)                                                                                 |
| `--message` (`-m`)  | Commit message when committing the delivery directory. (default `:rocket: {yyyy/mm/dd HH:MM}`)                                           |
| `--prefix` (`-p`)   | Internal prefix path of output zip file (default `.`)                                                                                    |

Note that `--output` and `--message` can include `{}`-wrapped date format. You can see supported syntax on [`node-dateformat` docs](https://github.com/felixge/node-dateformat#usage)

## License

MIT
