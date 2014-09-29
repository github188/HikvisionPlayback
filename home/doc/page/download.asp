<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link href="../css/playback.css" rel="stylesheet" type="text/css"/>
<title></title>
<script type="text/javascript" src="../script/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="../script/jquery.cookie.js"></script>
<script type="text/javascript" src="../script/common.js"></script>
<script type="text/javascript" src="../script/download.js"></script>
<script type="text/javascript" src="../script/Translator.js"></script>
    <script type="text/javascript">
        var m_szBrowser = navigator.appName;
        var m_szExit = "";

        var m_szHostName = "149.5.42.144";
        var m_lHttpPort = '8084';
        var m_lHttp = "http://";
        var m_lRtspPort = "554";
        var m_lUserName = 'admin';
        var m_lPassword = '12345';
    </script>
</head>
<body onload="InitDownload()" onunload="javascript:unLoadPage()">
<table width="680" height="458" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
  <tr>
    <td width="1" height="1" id='main_plugin'> 
    </td>
  </tr>
  <tr>
    <td height="19" valign="top"><table width="680" border="0" cellspacing="0" cellpadding="0" style="font-size:12px;line-height:18px " id="FileTable">
        <tr bgcolor="#DEDEDE"  style="" height="10">
          <td width="40" height="10" align="center"><input id="all" name="all" type="checkbox"  value="0" onclick="SelectAllFile()"></td>
          <td width="40" height="10" align="center"><label name="laSerialNumber"></label></td>
          <td width="140" align="center" ><label id="laFileName" name="laFileName"></label></td>
          <td width="140" align="center" ><label name="laStartTime"></label></td>
          <td width="140" align="center"><label name="laEndTime"></label></td>
          <td width="90" align="center"><label id="laFileSize" name="laFileSize"></label></td>
          <td width="90" align="center"><label id="laDownloadProcess" name="laDownloadProcess"></label></td>
        </tr>
      </table></td>
  </tr>
  <tr>
    <td><table width="100%" height="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td align="right" valign="bottom"><input id="DownloadBtn" name="DownloadBtn" type="button" class="Btn"  value="" onclick="DownLoadFile()"/></td>
          <td width="20"></td>
        </tr>
      </table></td>
  </tr>
  <tr height="10"> </tr>
</table>
<div id="Page" style="width:680px; height:25px; background-color:#DEDEDE" align="right"></div>
</body>
</html>
