<template>
	<el-card shadow="never">
		<h3 class="panel-header">
			开源项目
			<el-link type="primary" class="float-r no-print" @click="edit()">添加</el-link>
		</h3>
		<p class="text-a_c"></p>
		<draggable v-if="experienceList.length" handle=".drag-handle" @end="moved">
			<div v-for="(item,index) in experienceList" :class="{'no-print':item.hide}" :key="item.name">
				<el-form-auto
					v-if="editorIndex == index"
					size="small"
					:data="formData"
					v-model="model"
					label-width="90px"
				>
					<el-button size="medium" type="primary" @click="save">保存</el-button>
					<el-button size="medium" type="default" @click="cancel">取消</el-button>
				</el-form-auto>
				<template v-else>
					<h4>
						<a :href="item.url">
							<i class="fa fa-github"></i>
							{{item.name}}
						</a>

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
					<el-descriptions :column="1">
						<el-descriptions-item label="项目链接">
							<a :href="item.url">{{item.url}}</a>
						</el-descriptions-item>
						<el-descriptions-item label="项目简述">{{item.resume}}</el-descriptions-item>
					</el-descriptions>
				</template>
			</div>
		</draggable>
		<el-empty v-else description="请添加开源项目"></el-empty>
	</el-card>
</template>
<script lang="ts">
import { ElFormAutoField } from "element-ui-saas-extend/types/form-auto";
import { Vue, Component, Model } from "vue-property-decorator"

@Component
export default class EducationExperience extends Vue {

	@Model("input", { type: Array, default: () => [] }) experience!: any[]

	private model: Record<string, any> = {}

	get experienceList() {
		return this.experience.map((item: any) => {
			item = Object.assign({}, item)
			if (item.time) {
				item.time = item.time.join(" 至 ");
			} else {
				item.time = ""
			}
			return item;
		})
	}

	private save() {
		this.experience.splice(this.editorIndex, 1, Object.assign({}, this.model))
		this.model = {}
		this.editorIndex = -1;
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
		if (index == -1) {
			this.isNew = true;
			this.experience.splice(0, 0, {})
			index = 0;
		}
		this.isNew = false;
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

	private formData: Record<string, ElFormAutoField> = {
		name: {
			label: "项目名",
			type: "text",
			col: 12
		},
		url: {
			label: "项目链接",
			type: "text",
			col: 12
		},
		resume: {
			label: "项目简述",
			type: "textarea",
		},
	}

}
</script>
