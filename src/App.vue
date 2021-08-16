
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
			<person-info v-model="personInfo"></person-info>
			<open-source v-model="openSource"></open-source>
			<project-experience v-model="projectExperience" :company="company"></project-experience>
			<work-experience v-model="workExperience"></work-experience>
			<education-experience v-model="educationExperience"></education-experience>
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

	private personInfo: Record<string, any> | null = null
	private workExperience: Record<string, any>[] = []
	private projectExperience: Record<string, any>[] = []
	private educationExperience: Record<string, any>[] = []
	private openSource: Record<string, any>[] = []

	@Watch("personInfo", { deep: true })
	@Watch("workExperience")
	@Watch("projectExperience")
	@Watch("educationExperience")
	@Watch("openSource")
	private saveLocalStorage() {
		let { personInfo, workExperience, projectExperience, educationExperience, openSource } = this;
		let resumeContent = JSON.stringify({ personInfo, workExperience, projectExperience, educationExperience, openSource });
		window.localStorage.setItem(this.localStorageName, resumeContent)
		return resumeContent
	}

	get company() {
		return this.workExperience.map((item: any) => item.company)
	}

	private mounted() {
		let config = JSON.parse(window.localStorage.getItem(this.localStorageName) || "null");
		if (config) {
			Object.assign(this, config)
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
			// convert image file to base64 string
			// console.log(fReader.result);
			let config = JSON.parse(fReader.result as string);
			Object.assign(self, config)
		}, false);
		if (files)
			fReader.readAsText(files[0])
	}

}
</script>
