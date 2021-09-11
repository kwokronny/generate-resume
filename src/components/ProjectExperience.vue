<template>
	<el-card shadow="never">
		<h3 class="panel-header">
			项目经验
			<el-link type="primary" class="float-r no-print" @click="edit()">添加</el-link>
		</h3>
		<p class="text-a_c"></p>
		<template v-if="experienceList.length">
			<draggable handle=".drag-handle" @end="moved">
				<div v-for="(item,index) in experienceList" :key="item.name">
					<el-form-auto
						ref="Form"
						v-if="editorIndex == index"
						size="small"
						:data="formData"
						v-model="model"
						label-width="90px"
					>
						<template slot="appendInfo" slot-scope="{item,model,name}">
							<draggable handle=".append-handle" v-model="model.appendInfo">
								<div v-for="(info,index) in model.appendInfo" :key="index" class="spac-mb_10">
									<el-input v-model="info.label" class="spac-mr_5 spac-mb_10" placeholder="请输入信息标签">
										<el-button icon="el-icon-d-caret" class="append-handle" slot="prepend"></el-button>
										<el-button type="danger" plain @click="delectInfo(index)" slot="append">删除</el-button>
									</el-input>
									<el-input type="textarea" :rows="4" placeholder="请输入信息内容" v-model="info.value"></el-input>
								</div>
							</draggable>
							<el-button plain @click="addInfo()">添加信息</el-button>
						</template>
						<el-button size="medium" type="primary" @click="save">保存</el-button>
						<el-button size="medium" type="default" @click="cancel">取消</el-button>
					</el-form-auto>
					<div v-else :class="item.hide?'no-print':''">
						<h4>
							{{item.name}}
							<span class="float-r no-print">
								<el-checkbox :value="item.hide" @change="switchHide($event,index)">打印隐藏</el-checkbox>
								<el-link class="spac-mh_10 drag-handle" type="primary">
									<i class="el-icon-d-caret"></i>调序
								</el-link>
								<el-link class="spac-mr_10" type="primary" @click="edit(index)">编辑</el-link>
								<el-popconfirm title="确定删除吗？" @confirm="delect(index)">
									<el-link type="danger" slot="reference">删除</el-link>
								</el-popconfirm>
							</span>
						</h4>
						<el-descriptions>
							<el-descriptions-item label="所属公司" :span="3">
								<div v-html="item.belongCompany"></div>
							</el-descriptions-item>
							<el-descriptions-item label="项目描述" :span="3">
								<div v-html="item.resume"></div>
							</el-descriptions-item>
							<el-descriptions-item
								v-for="(info,i) in item.appendInfo"
								:label="info.label"
								:key="i"
								:span="3"
							>
								<div v-html="info.value"></div>
							</el-descriptions-item>
						</el-descriptions>
					</div>
				</div>
			</draggable>
		</template>
		<el-empty v-else description="请添加项目经验"></el-empty>
	</el-card>
</template>
<script lang="ts">
import { ElFormAutoField } from "element-ui-saas-extend/types/form-auto";
import { FormAuto } from "element-ui-saas-extend/types/saas-extend";
import { Vue, Component, Ref, Model, Prop } from "vue-property-decorator"

@Component
export default class ProjectExperience extends Vue {
	@Ref("Form") Form!: FormAuto[]

	@Prop(Array) company!: string[];

	@Model("input", { type: Array, default: () => [] }) experience!: any[]

	get experienceList() {
		return this.experience.map((item: any) => {
			item = Object.assign({}, item)
			if (item.time) {
				let timeLen = window.dayjs(item.time[0]).from(item.time[1], true)
				item.time = `${item.time.join(" 至 ")} [ ${timeLen} ]`;
			} else {
				item.time = ""
			}
			item.resume = (item.resume || "").replace(/(\n|\r)/g, "<br/>");
			item.appendInfo = (item.appendInfo || []).map((info: any) => {
				let item = Object.assign({}, info);
				item.value = (item.value || "").replace(/(\n|\r)/g, "<br/>")
				return item;
			})
			return item;
		})
	}

	private model: Record<string, any> = {}

	private async save() {
		try {
			if (await this.Form[0].validate()) {
				this.experience.splice(this.editorIndex, 1, Object.assign({}, this.model))
				this.model = {}
				this.editorIndex = -1;
			}
		} catch (err) { }
	}

	private cancel() {
		if (this.isNew) {
			this.experience.splice(this.editorIndex, 1)
		}
		this.editorIndex = -1;
		this.model = {};
	}

	private editorIndex = -1
	private isNew: boolean = false;

	private edit(index: number = -1) {
		if (this.editorIndex > -1) return;

		this.isNew = index == -1;
		if (index == -1) {
			this.experience.splice(0, 0, {})
			index = 0;
		}
		this.model = Object.assign({}, this.experience[index]);
		this.editorIndex = index;
	}

	private moved(evt: any) {
		let temp = this.experience[evt.newIndex]
		this.$set(this.experience, evt.newIndex, this.experience[evt.oldIndex])
		this.$set(this.experience, evt.oldIndex, temp)
	}

	private switchHide(value: boolean, index: number) {
		this.$set(this.experience[index], "hide", value)
	}

	private delect(index: number) {
		this.experience.splice(index, 1)
	}

	// private appendInfo: Record<string, string>[] = [];

	private addInfo() {
		this.model.appendInfo.push({
			label: "",
			value: ""
		});
	}

	private delectInfo(index: number) {
		this.model.appendInfo.splice(index, 1)
	}

	private async getCompany() {
		return this.company
	}

	private formData: Record<string, ElFormAutoField> = {
		name: {
			label: "项目名称",
			type: "text",
			required: true,
			col: 12
		},
		belongCompany: {
			label: "公司名称",
			type: "select",
			allowCreate: true,
			style: "width: 100%",
			options: this.getCompany,
			col: 12
		},
		resume: {
			label: "项目描述",
			type: "textarea",
			required: true,
			rows: 5
		},
		appendInfo: {
			label: "追加信息",
			type: "plain",
			slot: true,
			value: []
		}
	}

}
</script>
