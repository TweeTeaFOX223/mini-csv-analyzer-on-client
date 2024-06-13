import MicroModal from "micromodal"; //マイクロモーダルを読み込む
import * as dfd_s from "danfojs"; //danfojsを読み込む

//モーダルウィンドウの設定
MicroModal.init({
  awaitOpenAnimation: true, //開くときのアニメーション
  awaitCloseAnimation: true, //閉じるときのアニメーション
  disableScroll: false, //モーダルを開いた時でもスクロールできるよう
});

//ファイル読み込むボタンを押した時の処理
const inputFileButton = document.getElementById("input_csv_tsv_button");
const inputFileManager = document.getElementById("input_csv_tsv_file");
const inputFileNameText = document.getElementById("input-file-name");
inputFileButton.addEventListener("click", function () {
  inputFileManager.click();
});
// 選択されたファイル名を表示する処理(リロード時にも適用)
inputFileManager.addEventListener("change", function () {
  inputFileNameText.innerText = `読込中：${inputFileManager.files[0].name}`;
});
document.addEventListener("DOMContentLoaded", function () {
  if (inputFileManager.files[0] === undefined) {
    return;
  }
  if (inputFileManager.files[0].value !== "") {
    inputFileNameText.innerText = `読込中：${inputFileManager.files[0].name}`;
  }
});

// 設定画面を開くボタンを押した時の処理
const inputSettingButton = document.getElementById("inputfile_setting_button");
inputSettingButton.addEventListener("click", function () {
  MicroModal.show("manual-help-window");
  console.log("test");
});

//ファイル読み込むボタンを押した時の処理
const previewAnalysisButton = document.getElementById(
  "preview_analysis_button"
);
previewAnalysisButton.addEventListener("click", function () {
  loadInputFile();
});

// おすすめコマンド一覧のウィンドウを表示するボタン
document
  .getElementById("recommend_command_button")
  .addEventListener("click", function () {
    MicroModal.show("recommend_command_window");
  });

// ファイルを読み込む設定(toCSV関数の引数に設定する)
let inputSettings = {
  quotes: false, //or array of booleans
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ",",
  encoding: "",
  header: true,
  newline: "",
  skipEmptyLines: false,
  columns: null,
};

// ファイル名から拡張子を除く関数
// 参考：https://zenn.dev/sesaru/scraps/86c0005519366e
function removeExtension(fileName) {
  // 最後のドットの位置を見つける
  const lastDotIndex = fileName.lastIndexOf(".");
  // ドットが見つかった場合は、それ以前の部分を返す
  if (lastDotIndex > 0) {
    return fileName.substring(0, lastDotIndex);
  }
  // ドットが見つからない場合は、元のファイル名をそのまま返す
  return fileName;
}

// 入力されたら設定に基づいてファイルを読み込む関数
const loadInputFile = function () {
  if (inputFileManager.files[0] === undefined) {
    alert("ファイルが選択されていません！");
    return;
  }

  //データ分析パネルを無効化して、ファイル読み込み状況を読込中にする
  document.getElementById("data-analytics-field").disabled = true;
  document.getElementById("preview_analysis_button").innerHTML = "読込中…";
  document.getElementById("preview_analysis_button").disabled = true;
  document
    .getElementById("preview_analysis_button")
    .classList.add("btn-config-inactive");
  document
    .getElementById("preview_analysis_button")
    .classList.remove("btn-config");

  document.getElementById(
    "file_load_status"
  ).innerHTML = `読み込み状況：読み込み中…`;

  //コマンド一覧の、ファイル保存のコマンドに読み込んだファイル名を適用する。
  const fileName = removeExtension(inputFileManager.files[0].name);
  document.getElementById(
    "json_save_cmd"
  ).innerHTML = `dfd.toJSON(df, { fileName: "${fileName}.json", download: true });`;
  document.getElementById(
    "xlsx_save_cmd"
  ).innerHTML = `dfd.toExcel(df, { fileName: "${fileName}.xlsx"});`;
  document.getElementById(
    "csv_save_cmd"
  ).innerHTML = `df.toCSV({ fileName: "${fileName}.csv", download: true});`;
  document.getElementById(
    "tsv_save_cmd"
  ).innerHTML = `df.toCSV({ fileName: "${fileName}.tsv", download: true, sep: "\t"});`;

  // 区切り文字を設定オブジェクトに反映する。
  document.getElementsByName("opp_delimiter").forEach((elem) => {
    if (elem.checked) {
      if (elem.value == "others") {
        inputSettings.delimiter = document.getElementById(
          "opp_delimiter_others"
        ).value;
      } else {
        inputSettings.delimiter = elem.value;
      }
    }
  });

  // クォートを設定オブジェクトに反映
  document.getElementsByName("opp_quote").forEach((elem) => {
    if (elem.checked) {
      if (elem.value == "others") {
        inputSettings.quoteChar =
          document.getElementById("opp_quote_others").value;
      } else {
        inputSettings.quoteChar = elem.value;
      }
    }
  });

  // エスケープを設定オブジェクトに反映
  document.getElementsByName("opp_escape").forEach((elem) => {
    if (elem.checked) {
      if (elem.value == "others") {
        inputSettings.escapeChar =
          document.getElementById("opp_escape_others").value;
      } else {
        inputSettings.escapeChar = elem.value;
      }
    }
  });

  //改行文字を設定オブジェクトに反映
  document.getElementsByName("opp_newline").forEach((elem) => {
    if (elem.checked) {
      inputSettings.newline = elem.value;
    }
  });

  //エンコーディングを設定オブジェクトに反映
  document.getElementsByName("opp_encoding").forEach((elem) => {
    if (elem.checked) {
      inputSettings.encoding = elem.value;
    }
  });

  // コメント文字を設定オブジェクトに反映
  document.getElementsByName("opp_comment").forEach((elem) => {
    if (elem.checked) {
      if (elem.value == "false") {
        inputSettings.comments = false;
      } else {
        inputSettings.comments = elem.value;
      }
    }
  });

  // ヘッダーの有無を設定オブジェクトに反映
  document.getElementsByName("opp_header").forEach((elem) => {
    if (elem.checked) {
      if (elem.value === "true") {
        inputSettings.header = true;
      } else {
        inputSettings.header = false;
      }
    }
  });

  //  カラムのラベルを明示する場合に、設定オブジェクトに反映
  if (document.getElementById("opp_columns").value !== "") {
    inputSettings.columns = document
      .getElementById("opp_columns")
      .value.split(",");
  }

  // 読み込まれているファイルのデータを取得して読み込む
  const file = document.getElementById("input_csv_tsv_file");
  const fileData = file.files[0];
  // 読み込みに成功したらファイルに対する処理を開始する
  dfd_s.readCSV(fileData, inputSettings).then((loadedData) => {
    loadedData.print();

    // ファイルのカラムの情報を取得してhtmlに表示する
    const dataColumns = loadedData.columns;
    document.getElementById("preview_data_columns").value = dataColumns;

    //各カラムのデータの型・ユニークな要素の個数を表示する。
    const uniqueValues = loadedData.nUnique(0);
    const typeColumns = loadedData.ctypes;
    let uniqueValuesText = "";
    for (let i = 0; i < uniqueValues.index.length; i++) {
      uniqueValuesText += `${uniqueValues.$index[i]}：${typeColumns.$data[i]}：${uniqueValues.$data[i]}\n`;
    }
    document.getElementById("preview_data_allcolumns_count").value =
      uniqueValuesText;

    // データセットのカラムをセレクトのオプションに追加する
    const columnsSelect = document.getElementById("preview_data_select_column");
    while (columnsSelect.firstChild) {
      columnsSelect.removeChild(columnsSelect.firstChild);
    }
    dataColumns.forEach((column) => {
      const columnOption = document.createElement("option");
      columnOption.value = column;
      columnOption.textContent = column;
      columnsSelect.appendChild(columnOption);
    });

    //特定のカラムの、ユニークな要素の出現頻度を表示する。
    document
      .getElementById("preview_data_select_column")
      .addEventListener("change", function () {
        const selectedColumn = document.getElementById(
          "preview_data_select_column"
        ).value;

        // 何も選択されていなかったら空にしておく
        if (selectedColumn === "none") {
          document.getElementById("preview_data_one_columns_count").value = "";
          return;
        }

        // valueCountが少数を含むseriesでエラー出したので自作
        // https://danfo.jsdata.org/api-reference/series/series.value_counts
        const columnValues = loadedData[selectedColumn];
        let uniqueElems = {};

        // 連想配列を用いてユニークな要素の出現頻度をカウント
        for (let i = 0; i < columnValues.$index.length; i++) {
          const key = columnValues.$data[i];
          if (uniqueElems[key]) {
            uniqueElems[key] = uniqueElems[key] + 1;
          } else {
            uniqueElems[key] = 1;
          }
        }
        //連想配列をループさせて表示用テキストに入れていく
        let columnUniqueValuesText = "";
        console.log(uniqueElems);
        Object.entries(uniqueElems).forEach(([key, value]) => {
          columnUniqueValuesText += `${key}：${value}\n`;
        });
        document.getElementById("preview_data_one_columns_count").value =
          columnUniqueValuesText;
      });

    // 超重要 //////////////////////////////////////////////////////////////////
    // htmlの方のscriptタグで宣言したグローバル変数「df」に
    // 読み込まれたファイルのデータフレームを代入して、
    // ブラウザの開発者ツールで「df」に色々と操作ができるようにする。

    dfd = dfd_s;
    df = loadedData;

    // 超重要 //////////////////////////////////////////////////////////////////

    //データ分析パネルを有効化して、ファイル読み込み状況を成功にする
    document.getElementById("data-analytics-field").disabled = false;
    document.getElementById(
      "file_load_status"
    ).innerHTML = `読み込み状況：読み込み成功！`;

    document.getElementById("preview_analysis_button").innerHTML = "読み込む！";
    document.getElementById("preview_analysis_button").disabled = false;
    document
      .getElementById("preview_analysis_button")
      .classList.add("btn-config");
    document
      .getElementById("preview_analysis_button")
      .classList.remove("btn-config-inactive");
  });
};
