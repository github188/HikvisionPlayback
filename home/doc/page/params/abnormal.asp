<div class="subparamsgray width505">
	<span class="firstspan"><label id="laExceptionType" name="laExceptionType"></label></span>
	<span>
	    <select name="ExceptionType" id="ExceptionType" class="selectwidth" onChange="GetExceptionInfo()">
            <option value="diskfull" selected="selected" id='ExceptionTypeOpt1' name="hdFull"></option>
            <option value="diskerror" id='ExceptionTypeOpt2' name="hdError"></option>
            <option value="nicbroken" id='ExceptionTypeOpt3' name="ExceptionTypeOpt3"></option>
            <option value="ipconflict" id='ExceptionTypeOpt4' name="ExceptionTypeOpt4"></option>
            <option value="illaccess" id='ExceptionTypeOpt5' name="ExceptionTypeOpt5"></option>
        </select>
	</span>
</div>
<div class="margintop10">
	<table id="tableEventLinkage" class="linkagetable" cellpadding="0" cellspacing="0">
	    <tr class="linkagetitle">
		    <td class="paddingleft5 borderc0c0c0"><label id="laNormalLink" name="laNormalLink"></label></td>
		    <td class="paddingleft5 borderc0c0c0"><label id="laOtherLink" name="laOtherLink"></label></td>
		</tr>
		<tr>
		    <td valign="top" class="borderc0c0c0">
		        <table>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="ExSoundAlarm" class="checkbox" type="checkbox" id="ExSoundAlarm"/>&nbsp;
				            <label id="laSoundAlarm" name="laSoundAlarm"></label>
						</td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="ExUpload" class="checkbox" type="checkbox" id="ExUpload"/>&nbsp;
				            <label id="laUpload" name="laUpload"></label>
						</td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="ExEmail" class="checkbox" type="checkbox" id="ExEmail" />&nbsp;
				            <label id="laEmail" name="laEmail"></label>
						</td>
			        </tr>			  			  
			    </table>
		    </td>
		    <td valign="top" class="borderc0c0c0">
		        <table>
			        <tr>
			            <td class="height25 paddingleft5">
                            <label name="laLinkageAlarmOutput"></label>
				            <input name="SelectAllAlarmOutputBox"  class="checkbox" type="checkbox" id="SelectAllAlarmOutputBox"  onclick="SelectAllAlarmOutputToLinkage()"/>
				            <label name="laSelectAll"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <span id="DisPlayLinkageList"></span>
				        </td>
			        </tr>
			    </table>
		    </td>		  
		</tr>
	</table>
</div>