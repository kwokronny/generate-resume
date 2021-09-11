
<template>
	<el-container>
		<el-header class="no-print">
			<el-menu mode="horizontal">
				<el-menu-item @click="exportFile">导出</el-menu-item>
				<el-menu-item>
					<div class="upload-btn spac-mr_5">
						<input ref="Import" type="file" accept=".json" @change="importFile" />导入
					</div>
				</el-menu-item>
			</el-menu>
		</el-header>
		<div class="container">
			<draggable v-model="resume" handle=".drag-handle">
				<div v-for="(item,index) in resume" :key="`panel_${index}`" :class="{'no-print':item.hide}">
					<div class="no-print">
						<el-checkbox v-model="item.hide">打印隐藏</el-checkbox>
						<el-link class="spac-mh_10 drag-handle" type="primary">
							<i class="el-icon-d-caret"></i>调序
						</el-link>
						<!-- <el-popconfirm title="确定删除吗？" @confirm="delect(index)">
							<el-link type="danger" slot="reference">删除</el-link>
						</el-popconfirm>-->
					</div>
					<person-info v-if="item.type=='PersonInfo'" v-model="item.data"></person-info>
					<open-source v-else-if="item.type=='OpenSource'" v-model="item.data"></open-source>
					<project-experience
						v-else-if="item.type=='ProjectExperience'"
						v-model="item.data"
						:company="company"
					></project-experience>
					<work-experience v-else-if="item.type=='WorkExperience'" v-model="item.data"></work-experience>
					<education-experience v-else-if="item.type=='EducationExperience'" v-model="item.data"></education-experience>
				</div>
			</draggable>
		</div>
	</el-container>
</template>
<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator"
import PersonInfo from "./components/PersonInfo.vue"
import WorkExperience from "./components/WorkExperience.vue"
import ProjectExperience from "./components/ProjectExperience.vue"
import EducationExperience from "./components/EducationExperience.vue"
import OpenSource from "./components/OpenSource.vue"
import { downloadText } from "download.js"

interface PanelStruc {
	type: "PersonInfo" | "WorkExperience" | "ProjectExperience" | "EducationExperience" | "OpenSource";
	data: any
	hide?: boolean;
}

@Component({
	components: {
		PersonInfo,
		WorkExperience,
		ProjectExperience,
		EducationExperience,
		OpenSource
	}
})
export default class App extends Vue {
	@Ref("Import") ImportInput!: HTMLInputElement;
	private localStorageName = "simple_resume"

	@Watch("resume", { deep: true })
	private saveLocalStorage() {
		let resumeContent = JSON.stringify(this.resume);
		window.localStorage.setItem(this.localStorageName, resumeContent)
		return resumeContent
	}

	private resume: PanelStruc[] = [{
		type: "PersonInfo",
		data: null
	}, {
		type: "OpenSource",
		data: []
	}, {
		type: "ProjectExperience",
		data: []
	}, {
		type: "WorkExperience",
		data: []
	}, {
		type: "EducationExperience",
		data: []
	}]

	get company() {
		return this.resume.filter((item: any) => item.type == "WorkExperience").map((item: any) => item.data.map((item: any) => item.company)).flat(1);
	}

	private delect(index: number) {
		this.resume.splice(index, 1)
	}

	private mounted() {
		let config = JSON.parse(window.localStorage.getItem(this.localStorageName) || "null");
		if (config) {
			this.resume = config;
		}
	}

	private exportFile() {
		let resumeContext = this.saveLocalStorage();
		downloadText("resume.json", resumeContext)
	}

	private importFile(file: Blob) {
		let files = this.ImportInput.files;
		let fReader = new FileReader();
		let self = this;
		fReader.addEventListener("load", function () {
			let config = JSON.parse(fReader.result as string);
			self.resume = config;
		}, false);
		if (files)
			fReader.readAsText(files[0])
	}


}
</script>
