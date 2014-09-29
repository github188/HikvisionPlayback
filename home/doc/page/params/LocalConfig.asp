<ul class="tabs">
    <li><a id="aLocalConfig" name="aLocalConfig" href="javascript: ia(LocalConfig).update();"></a></li>
</ul>
<div class="panes">
	<div id="diLocalConfig" class="panewidth">
		<div id="diPlayParams">
			<div class="mainparams">
				<label name="laPlayParams" id="laPlayParams"></label>
			</div>
			<div id="spAgreementType" class="subparamswhite">
				<span class="firstspan"><label name="laProtocolType"></label></span>
				<span class="localsecondspan">
				    <input type="radio" value="0" name="raAgreementType" />&nbsp;
				    <label>TCP</label>
				</span>
				<span class="localsecondspan">
				    <input type="radio" value="2" name="raAgreementType" />&nbsp;
				    <label>UDP</label>
				</span>
                <span class="localsecondspan">
				    <input type="radio" value="3" name="raAgreementType" />&nbsp;
				    <label>MULTICAST</label>
				</span>
                <span>
				    <input type="radio" value="4" name="raAgreementType" />&nbsp;
				    <label>HTTP</label>
				</span>
			</div>
			<div id="spStreamType" class="subparamsgray displaynone">
				<span class="firstspan"><label name="laStreamType"></label></span>
				<span class="localsecondspan">
				    <input type="radio" value="0" onclick="pr(LocalConfig).setRadioItem('spStreamType', $(this).val())" />&nbsp;
				    <label name="streamTypeOpt1" id="streamTypeOpt1"></label>
				</span>
				<span class="localsecondspan">
				    <input type="radio" value="1" onclick="pr(LocalConfig).setRadioItem('spStreamType', $(this).val())" />&nbsp;
				    <label name="streamTypeOpt2" id="streamTypeOpt2"></label>
				</span>
			</div>
			<div id="spWindowProportion" class="subparamswhite displaynone">
				<span class="firstspan"><label name="lawindowProportion" id="lawindowProportion"></label></span>
				<span class="localsecondspan">
				    <input type="radio" value="0" onclick="pr(LocalConfig).setRadioItem('spWindowProportion', $(this).val())" />&nbsp;
				    <label name="windowProportionOpt1" id="windowProportionOpt1"></label>
				</span>
				<span class="localsecondspan">
				    <input type="radio" value="1" onclick="pr(LocalConfig).setRadioItem('spWindowProportion', $(this).val())" />&nbsp;
				   <label>4:3</label>
				</span>
				<span class="localsecondspan">
				    <input type="radio" value="2" onclick="pr(LocalConfig).setRadioItem('spWindowProportion', $(this).val())" />&nbsp;
				    <label>16:9</label>
				</span>
			</div>
			<div id="spNetsPreach" class="subparamsgray">
				<span class="firstspan"><label name="lanetsPreach" id="lanetsPreach"></label></span>
				<span class="localsecondspan">
				    <input type="radio" value="1" name="raNetsPreach" />&nbsp;
				    <label name="netsPreach2" id="netsPreach2"></label>
				</span>
				<span class="localsecondspan">
				    <input type="radio" value="2" name="raNetsPreach" />&nbsp;
				    <label name="netsPreach3" id="netsPreach3"></label>
				</span>
				<span class="localsecondspan">
				    <input type="radio" value="3" name="raNetsPreach"  />&nbsp;
				    <label name="netsPreach4" id="netsPreach4"></label>
				</span>
			</div>
		</div>
		<div id="diRecordFileParams">
			<div class="mainparams margintop26">
				<label name="laRecordFileParams" id="laRecordFileParams"></label>
			</div>
			<div id="spPackSize" class="subparamswhite">
			    <span class="firstspan"><label id="lapackSize" name="lapackSize"></label></span>
				<span class="localsecondspan">
				    <input type="radio" value="0" onclick="pr(LocalConfig).setRadioItem('spPackSize', $(this).val())" />&nbsp;
				    <label>256M</label>
				</span>
				<span class="localsecondspan">
				    <input type="radio" value="1" onclick="pr(LocalConfig).setRadioItem('spPackSize', $(this).val())" />&nbsp;
				    <label>512M</label>
				</span>
				<span class="localsecondspan">
				    <input type="radio" value="2" onclick="pr(LocalConfig).setRadioItem('spPackSize', $(this).val())" />&nbsp;
				    <label>1G</label>
				</span>
			</div>
			<div class="subparamsgray">
			    <span class="firstspan"><label name="laRecordPath" id="laRecordPath"></label></span>
				<span class="pathsecondspan"><input id="teRecordPath" class="verticalmiddle" type="text" readonly="readonly" /></span>
				<span class="paththirdspan"><input name="btnBrowse" id="btnRecordPath" type="button" onclick="browseFilePath('teRecordPath', 0)" /></span>
			</div>
			<div class="subparamswhite">
			    <span class="firstspan"><label name="laDownloadPath" id="laDownloadPath"></label></span>
				<span class="pathsecondspan"><input id="teDownloadPath" class="verticalmiddle" type="text" readonly="readonly" /></span>
				<span class="paththirdspan"><input name="btnBrowse" id="btnDownloadPath" type="button" onclick="browseFilePath('teDownloadPath', 0)" /></span>
			</div>
		</div>
		<div id="diCaptureClipParams">
			<div class="mainparams margintop26">
				<label name="laCaptureClipParams" id="laCaptureClipParams"></label>
			</div>
			<div class="subparamswhite">
			    <span class="firstspan"><label name="laPreviewPicPath" id="laPreviewPicPath"></label></span>
				<span class="pathsecondspan"><input id="tePreviewPicPath" class="verticalmiddle" type="text" readonly="readonly" /></span>
				<span class="paththirdspan"><input name="btnBrowse" id="btnPreviewPicPath" type="button" onclick="browseFilePath('tePreviewPicPath', 0)" /></span>	
			</div>
			<div class="subparamsgray">
			    <span class="firstspan"><label name="laPlaybackPicPath" id="laPlaybackPicPath"></label></span>
				<span class="pathsecondspan"><input id="tePlaybackPicPath" class="verticalmiddle" type="text" readonly="readonly" /></span>
				<span class="paththirdspan"><input name="btnBrowse" id="btnPlaybackPicPath" type="button" onclick="browseFilePath('tePlaybackPicPath', 0)" /></span>	
			</div>
			<div class="subparamswhite">
			    <span class="firstspan"><label name="laPlaybackFilePath" id="laPlaybackFilePath"></label></span>
				<span class="pathsecondspan"><input id="tePlaybackFilePath" class="verticalmiddle" type="text" readonly="readonly" /></span>
				<span class="paththirdspan"><input name="btnBrowse" id="btnPlaybackFilePath" type="button" onclick="browseFilePath('tePlaybackFilePath', 0)" /></span>
			</div>
		</div>
		<div id="main_plugin" name="main_plugin" class="plugin0"></div>
	</div>
</div>