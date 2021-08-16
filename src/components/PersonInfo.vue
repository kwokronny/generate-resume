<template>
	<div>
		<el-card shadow="never">
			<el-form-auto
				v-if="editStatus"
				ref="Form"
				size="small"
				:data="formData"
				v-model="model"
				label-width="120px"
			>
				<!-- <template slot-scope="{item,model,name}" slot="avatar">
					<el-upload v-model="model[name]">
						<img v-if="imageUrl" :src="imageUrl" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</template>-->
				<el-button size="medium" type="primary" @click="save">保存</el-button>
				<el-button size="medium" type="default" @click="cancel">取消</el-button>
			</el-form-auto>
			<div v-else-if="personInfo">
				<h3>
					个人信息
					<el-link class="float-r no-print" type="primary" @click="edit">编辑</el-link>
				</h3>
				<el-descriptions size="medium">
					<el-descriptions-item label="姓名">{{personInfo.name}}</el-descriptions-item>
					<el-descriptions-item label="性别">{{personInfo.gender}}</el-descriptions-item>
					<el-descriptions-item label="个人网站">
						<a :href="personInfo.site">{{personInfo.site}}</a>
					</el-descriptions-item>
					<el-descriptions-item label="手机">{{personInfo.phone}}</el-descriptions-item>
					<el-descriptions-item label="邮箱">{{personInfo.email}}</el-descriptions-item>
					<el-descriptions-item label="微信" v-if="personInfo.wechat">{{personInfo.wechat}}</el-descriptions-item>
					<el-descriptions-item label="Github" v-if="personInfo.github">
						<a :href="`https://github.com/${personInfo.github}`">{{personInfo.github}}</a>
					</el-descriptions-item>
					<!-- <el-descriptions-item label="应聘职位">{{personInfo.jobs}}</el-descriptions-item> -->
					<!-- <el-descriptions-item label="学历">{{personInfo.}}</el-descriptions-item> -->
				</el-descriptions>
			</div>
			<el-empty v-else description="请先填写信息">
				<p class="text-a_c">
					<el-button type="primary" size="small" plain @click="edit">编辑</el-button>
				</p>
			</el-empty>
		</el-card>
		<el-card v-if="personInfo" shadow="never">
			<h3>个人简述</h3>
			<div v-html="personInfo.resume"></div>
		</el-card>
	</div>
</template>
<script lang="ts">
import { FormAuto } from "element-ui-saas-extend/types/saas-extend";
import { ElFormAutoField } from "element-ui-saas-extend/types/form-auto";
import { Vue, Component, Model, Ref } from "vue-property-decorator"

@Component
export default class PersonInfo extends Vue {
	@Ref("Form") Form!: FormAuto

	@Model("input", { type: Object, default: () => { } }) value!: Record<string, any>

	private model: Record<string, any> = {}

	get personInfo(): Record<string, any> | null {
		if (this.value) {
			document.title = `${this.value.phone}${this.value.name}`
			return Object.assign({}, this.value, {
				phone: this.value.phone.replace(/\B(?=(?:\d{4})+$)/g, '-'),
				resume: (this.value.resume || "").replace(/\r|\n/g, "<br/>")
			})
		} else {
			return null;
		}
	}

	private async save() {
		if (await this.Form.validate()) {
			this.$emit("input", Object.assign({}, this.model))
			this.editStatus = false;
		}
	}

	private cancel() {
		this.editStatus = false;
	}

	private editStatus: boolean = false;

	private edit(index: number = -1) {
		this.model = Object.assign({}, this.value)
		this.editStatus = true;
	}


	private formData: Record<string, ElFormAutoField> = {
		// avatar: {
		// 	label: "头像",
		// 	type: "plain",
		// 	slot: true
		// },
		name: {
			label: "姓名",
			type: "text",
			required: true,
			col: 8
		},
		birthday: {
			label: "出生年月",
			type: "month",
			format: "yyyy-MM",
			valueFormat: "yyyy年MM月",
			style: "width: 100%",
			col: 8
		},
		gender: {
			label: "性别",
			required: true,
			type: "radio",
			options: ["男", "女"],
			col: 8
		},
		site: {
			label: "网站",
			type: "text",
			col: 8
		},
		jobs: {
			label: "应聘职位",
			required: true,
			type: "text",
			col: 8
		},
		phone: {
			label: "手机",
			required: true,
			type: "text",
			col: 8,
		},
		email: {
			label: "邮箱",
			required: true,
			type: "text",
			col: 8,
		},
		wechat: {
			label: "微信",
			type: "text",
			col: 8
		},
		github: {
			label: "github",
			type: "text",
			col: 8
		},
		resume: {
			label: "个人简述",
			type: "textarea",
			rows: 8,
		},
		showEducation: {
			col: 5,
			label: "显示最高学历",
			type: "switch",
		}
	}

}
</script>
